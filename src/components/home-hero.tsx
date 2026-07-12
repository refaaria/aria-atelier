"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { GoldButton, EASE } from "@/components/motion-primitives";
import { WatchVisual } from "@/components/watch-visual";
import { WatchCanvas } from "@/components/three/watch-canvas";
import { watchById } from "@/data/watches";

function smoothToBottom() {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
}

const words = ["Time,", "Curated", "to", "Perfection."];
const heroWatch = watchById("rolex-submariner-date")!;

const dust = Array.from({ length: 22 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r = seed / 233280;
  const r2 = ((i * 4021 + 7919) % 100) / 100;
  return { l: `${6 + r * 88}%`, t: `${8 + r2 * 84}%`, s: 2 + (i % 3), d: (i % 5) * 0.5, dur: 9 + (i % 6) };
});

export function HomeHero() {
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(900);
  useEffect(() => {
    const on = () => setVh(window.innerHeight);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // The big hero watch shrinks away as you scroll, handing off to a small
  // watch pinned in the bottom-right corner that follows you to the bottom.
  const heroOpacity = useTransform(scrollY, [0, vh * 0.4, vh * 0.7], [1, 0.9, 0]);
  const heroScale = useTransform(scrollY, [0, vh * 0.7], [1, 0.66]);
  const heroX = useTransform(scrollY, [0, vh * 0.7], [0, 60]);
  const heroY = useTransform(scrollY, [0, vh * 0.7], [0, 60]);
  const miniOpacity = useTransform(scrollY, [vh * 0.5, vh * 0.82], [0, 1]);
  const textY = useTransform(scrollY, [0, vh], [0, 90]);
  const textFade = useTransform(scrollY, [0, vh * 0.7], [1, 0]);

  const [docked, setDocked] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setDocked(v > vh * 0.6));

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink pt-28">
      {/* ---------- ambient background ---------- */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-14%] top-[0%] h-[880px] w-[880px] rounded-full bg-[radial-gradient(circle,rgba(70,110,95,0.16),transparent_62%)] blur-2xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[-18%] bottom-[-14%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(194,163,95,0.16),transparent_65%)] blur-2xl"
        animate={{ x: [0, -30, 0], y: [0, -22, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[30%] top-[10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(150,180,200,0.10),transparent_65%)] blur-2xl"
        animate={{ x: [0, 40, 0], y: [0, 40, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* rotating light rays */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_0deg_at_64%_40%,transparent,rgba(194,163,95,0.07)_8%,transparent_16%,transparent,rgba(150,180,200,0.05)_58%,transparent_66%)]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      {/* fine grid shimmer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {dust.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-gold/50"
            style={{ left: p.l, top: p.t, width: p.s, height: p.s }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: p.dur, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* concentric rings (desktop) */}
      <div className="pointer-events-none absolute right-[9%] top-1/2 hidden -translate-y-1/2 lg:block" aria-hidden>
        {[860, 680, 520, 380].map((s, i) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: [0, 0.5 - i * 0.08, 0.3 - i * 0.05], scale: 1 }}
            transition={{ duration: 2.4, delay: 0.4 + i * 0.12, ease: EASE, opacity: { duration: 4, repeat: Infinity, repeatType: "reverse" } }}
            className="absolute rounded-full border border-gold/12"
            style={{ width: s, height: s, left: -s / 2, top: -s / 2 }}
          />
        ))}
      </div>

      {/* ---------- big hero watch — real 3D, drag to explore (fades on scroll) ---------- */}
      <div className="fixed right-[3%] top-1/2 z-[5] hidden -translate-y-1/2 lg:block">
        <motion.div style={{ x: heroX, y: heroY, scale: heroScale, opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
            className="relative"
          >
            <WatchCanvas watch={heroWatch} className="h-[540px] w-[560px]" tilt={0.3} />
            <motion.div
              className="pointer-events-none absolute inset-x-0 bottom-2 text-center overline text-[0.58rem] text-gold/70"
              animate={{ opacity: [0.35, 0.8, 0.35] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Drag to explore
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ---------- clickable follow watch, pinned bottom-right ---------- */}
      <motion.button
        type="button"
        onClick={smoothToBottom}
        style={{ opacity: miniOpacity }}
        className={`group fixed bottom-6 right-6 z-[6] hidden lg:block ${docked ? "cursor-pointer" : "pointer-events-none"}`}
        aria-label="Scroll to enquire"
      >
        <div className="relative">
          <div className="absolute left-1/2 top-1/2 -z-10 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(8,8,7,0.92),transparent_70%)] blur-lg" />
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/40"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <WatchVisual watch={heroWatch} size={104} glow float className="transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap overline text-[0.55rem] text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Enquire ↓
          </span>
        </div>
      </motion.button>

      {/* ---------- content ---------- */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 md:px-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div style={{ y: textY, opacity: textFade }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: EASE }} className="overline text-gold">
            Aria&apos;s Atelier — Haute Horlogerie
          </motion.div>

          <h1 className="mt-7 font-serif text-5xl leading-[1.08] tracking-tight text-[#f6f2e9] sm:text-6xl md:text-7xl">
            {words.map((w, i) => (
              <motion.span
                key={w}
                className="mr-[0.26em] inline-block"
                initial={{ opacity: 0, y: "0.5em", filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.4 + i * 0.12, ease: EASE }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1, ease: EASE }} className="mt-8 max-w-md text-[15px] leading-relaxed text-[#f4f1ea]/50">
            An intimate boutique of the world&apos;s finest timepieces. Rolex, Omega, Audemars
            Piguet, Cartier and beyond — each piece hand-selected, authenticated and presented
            with the reverence it deserves.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2, ease: EASE }} className="mt-10 flex flex-wrap gap-4">
            <GoldButton href="/maisons">Explore the Maisons</GoldButton>
            <GoldButton href="/gallery" variant="outline">Visit the Gallery</GoldButton>
          </motion.div>
        </motion.div>

        {/* mobile in-flow watch */}
        <div className="flex justify-center lg:hidden">
          <motion.div initial={{ scale: 0.86 }} animate={{ scale: 1 }} transition={{ duration: 1.4, delay: 0.4, ease: EASE }}>
            <WatchVisual watch={heroWatch} size={260} glow ring />
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div style={{ opacity: textFade }} className="absolute bottom-8 left-6 flex items-center gap-3 md:left-10">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="flex items-center gap-3 overline text-[#f4f1ea]/40">
          <ChevronDown size={14} className="text-gold" />
          Scroll
        </motion.div>
      </motion.div>
    </section>
  );
}
