"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ======================= CONFIG ======================= */
/** Total number of sequential frames in `public/frames`. */
const FRAME_COUNT = 240;
/** Builds the public URL for frame `i` (1-based), zero-padded to 3 digits. */
const framePath = (i: number) => `/frames/ezgif-frame-${String(i).padStart(3, "0")}.webp`;
/** Native frame dimensions — used for the "contain" fit math (9:16). */
const FRAME_WIDTH = 720;
const FRAME_HEIGHT = 1280;
/** Scroll smoothing: higher = smoother/laggier, 0 = locked to scroll. */
const SCRUB = 0.6;
/** How many frames must decode before we fade the canvas in. */
const REVEAL_THRESHOLD = 8;
/** Cap device pixel ratio so retina backing stores stay cheap. */
const MAX_DPR = 2;
/** Frame held when the user prefers reduced motion (no scrubbing). */
const REDUCED_MOTION_FRAME = 0;
/**
 * Where the watch sits in the viewport. Anchored to the RIGHT on desktop so
 * frame 0 merges with the hero's right-side 3D watch; recentred on narrow
 * screens so it isn't pushed off-canvas. `cx`/`cy` are the watch box centre as
 * a fraction of the viewport; `wFrac`/`hFrac` are the box size the watch is
 * contain-fit into (whole watch always visible, never cropped). Tune freely.
 */
const WATCH_ANCHOR = {
  desktop: { cx: 0.75, cy: 0.5, wFrac: 0.5, hFrac: 0.82 },
  mobile: { cx: 0.5, cy: 0.5, wFrac: 0.92, hFrac: 0.62 },
};
/** Below this CSS width we use the mobile anchor (matches Tailwind `lg`). */
const DESKTOP_MIN_WIDTH = 1024;
/* ====================================================== */

type ScrollSequenceBgProps = {
  /**
   * Element (or selector) whose scroll range drives the sequence.
   * Defaults to the whole document, so frame 0 sits at the top of the page and
   * the final frame lands when you reach the bottom. Point this at a section
   * ref/selector later to bind the watch to a specific scroll range.
   */
  trigger?: Element | string;
  /** ScrollTrigger `start` (default "top top"). */
  start?: string;
  /** ScrollTrigger `end` (default "bottom bottom"). */
  end?: string;
  className?: string;
};

export function ScrollSequenceBg({
  trigger,
  start = "top top",
  end = "bottom bottom",
  className = "",
}: ScrollSequenceBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // SSR-safe: everything that touches window/document lives in here.
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Decoded <img> objects, indexed 0..FRAME_COUNT-1.
    const frames: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    let loadedCount = 0;
    let revealed = false;

    // Animatable frame index — gsap tweens this, onUpdate paints.
    const state = { frame: prefersReduced ? REDUCED_MOTION_FRAME : 0 };

    /* ---------- nearest decoded frame (never draw blank mid-scroll) ---------- */
    function nearestLoaded(idx: number): HTMLImageElement | null {
      for (let d = 1; d < FRAME_COUNT; d++) {
        const lo = frames[idx - d];
        if (lo && lo.complete && lo.naturalWidth) return lo;
        const hi = frames[idx + d];
        if (hi && hi.complete && hi.naturalWidth) return hi;
      }
      return null;
    }

    /* ---------- draw one frame, transparent + "contain"-fit, anchored ---------- */
    function drawContain(img: HTMLImageElement) {
      if (!ctx) return;
      const cw = canvas!.clientWidth;
      const ch = canvas!.clientHeight;
      // Transparent layer: clear, never fill a background colour, so the page's
      // own animated background shows through everywhere the watch isn't.
      ctx.clearRect(0, 0, cw, ch);

      const iw = img.naturalWidth || FRAME_WIDTH;
      const ih = img.naturalHeight || FRAME_HEIGHT;

      // Contain-fit into an anchored box (right on desktop, centred on mobile)
      // so the watch overlaps the hero's right-side watch at the top.
      const a = window.innerWidth >= DESKTOP_MIN_WIDTH ? WATCH_ANCHOR.desktop : WATCH_ANCHOR.mobile;
      const boxW = cw * a.wFrac;
      const boxH = ch * a.hFrac;
      const scale = Math.min(boxW / iw, boxH / ih); // whole watch visible, never cropped
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = cw * a.cx - dw * 0.5;
      const dy = ch * a.cy - dh * 0.5;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    /* ---------- paint whatever frame `state.frame` points at ---------- */
    function render() {
      let idx = Math.round(state.frame);
      idx = Math.max(0, Math.min(FRAME_COUNT - 1, idx));
      let img = frames[idx];
      if (!img || !img.complete || !img.naturalWidth) {
        img = nearestLoaded(idx) ?? undefined;
      }
      if (img) drawContain(img);
    }

    /* ---------- size the backing store to CSS box × DPR (crisp on retina) ---------- */
    function sizeCanvas() {
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const rect = canvas!.getBoundingClientRect();
      // Guard a 0-dimension measurement — never blow the backing store away.
      if (rect.width < 1 || rect.height < 1) return;
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
      render();
    }

    function reveal() {
      canvas!.style.opacity = "1";
    }

    /* ---------- preload every frame ---------- */
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(i + 1);
      const onSettle = () => {
        loadedCount++;
        if (!revealed && loadedCount >= REVEAL_THRESHOLD) {
          revealed = true;
          reveal();
          render();
        } else if (i === Math.round(state.frame)) {
          // The frame on screen just decoded — repaint it sharp.
          render();
        }
        if (loadedCount === FRAME_COUNT) {
          reveal();
          render();
        }
      };
      img.onload = onSettle;
      img.onerror = onSettle;
      frames[i] = img;
    }

    // Size now, and re-size precisely when the canvas box changes — a
    // ResizeObserver fires after layout settles for ANY cause (viewport resize,
    // orientation flip, mobile browser-chrome show/hide). Far more reliable than
    // the window "resize" event, which races and can leave a stale backing store.
    sizeCanvas();
    const ro = new ResizeObserver(() => sizeCanvas());
    ro.observe(canvas);

    /* ---------- scroll → frame via GSAP ScrollTrigger (no pin) ---------- */
    gsap.registerPlugin(ScrollTrigger);
    const ctxAnim = gsap.context(() => {
      if (prefersReduced) {
        // Hold one static frame — no scrub trigger at all.
        render();
        return;
      }
      // Whole-page default: scrub across the entire scrollable range. Using a
      // document/body element as a `trigger` with "bottom bottom" collapses to a
      // zero-length range, so drive it by absolute scroll positions instead
      // (start 0 → maxScroll), re-measured on every refresh. Pass a `trigger`
      // prop to bind the sequence to a specific section's scroll range instead.
      const st: ScrollTrigger.Vars = trigger
        ? { trigger, start, end, scrub: SCRUB, invalidateOnRefresh: true }
        : {
            start: 0,
            end: () => ScrollTrigger.maxScroll(window),
            scrub: SCRUB,
            invalidateOnRefresh: true,
          };
      gsap.to(state, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        snap: "frame", // land on whole frames — no fractional blur
        // NO pin — the canvas is position:fixed and stays put on its own.
        scrollTrigger: st,
        onUpdate: render,
      });
    });

    // Cleanup: revert kills the tween + ScrollTrigger so Next navigation and
    // Fast Refresh never stack duplicate triggers.
    return () => {
      ro.disconnect();
      ctxAnim.revert();
    };
  }, [trigger, start, end]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // Fixed background layer: never traps pointer events, never fills a bg.
      // z-3 sits ABOVE the hero video (z-1) and animated backdrop (z-2) and
      // BELOW all page content (hero content z-10, sections lifted to z-4).
      className={`pointer-events-none fixed inset-0 z-[3] h-full w-full ${className}`}
      style={{ opacity: 0, transition: "opacity 700ms ease" }}
    />
  );
}
