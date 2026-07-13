"use client";

import { useEffect, useRef } from "react";

/**
 * Looping muted background video that reliably autoplays. Browsers often block
 * or defer muted autoplay (power-saving, strict autoplay policies, hydration
 * timing) — which shows up as "the video is stuck until you scroll". This forces
 * playback on mount and re-tries on buffering, tab-visibility, an unexpected
 * pause, and (as a last resort) the first user gesture, so it just plays and
 * keeps playing without stops.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    v.muted = true; // set as a property (not just attribute) so autoplay is allowed
    let cancelled = false;

    const play = () => {
      if (cancelled) return;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    play();

    // Re-try once enough data has buffered.
    v.addEventListener("canplay", play);
    v.addEventListener("loadeddata", play);
    // Resume if the browser paused it while it should be playing (not tab-hidden).
    const onPause = () => {
      if (!document.hidden && !v.ended) play();
    };
    v.addEventListener("pause", onPause);
    // Resume when the tab comes back to the foreground.
    const onVisible = () => {
      if (!document.hidden) play();
    };
    document.addEventListener("visibilitychange", onVisible);
    // Last-resort fallback for strict autoplay policies: the first user gesture.
    const onGesture = () => play();
    window.addEventListener("pointerdown", onGesture, { once: true });
    window.addEventListener("touchstart", onGesture, { once: true, passive: true });
    window.addEventListener("scroll", onGesture, { once: true, passive: true });

    return () => {
      cancelled = true;
      v.removeEventListener("canplay", play);
      v.removeEventListener("loadeddata", play);
      v.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("touchstart", onGesture);
      window.removeEventListener("scroll", onGesture);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    >
      <source src="/website_background.mp4" type="video/mp4" />
    </video>
  );
}
