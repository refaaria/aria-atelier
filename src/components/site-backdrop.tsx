"use client";

import { motion } from "motion/react";
import { EASE } from "@/components/motion-primitives";

const dust = Array.from({ length: 22 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r = seed / 233280;
  const r2 = ((i * 4021 + 7919) % 100) / 100;
  return { l: `${6 + r * 88}%`, t: `${8 + r2 * 84}%`, s: 2 + (i % 3), d: (i % 5) * 0.5, dur: 9 + (i % 6) };
});

/**
 * The homepage's animated ambient background — glow blobs, rotating light rays,
 * grid shimmer, drifting dust and concentric rings. Rendered as a `fixed`
 * full-viewport layer (z-2) so it stays put and FOLLOWS the scroll all the way
 * down the page, sitting above the hero video (z-1) and below the watch (z-3).
 */
export function SiteBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      <motion.div
        className="absolute right-[-14%] top-[0%] h-[880px] w-[880px] rounded-full bg-[radial-gradient(circle,rgba(70,110,95,0.16),transparent_62%)] blur-2xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[-18%] bottom-[-14%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(194,163,95,0.16),transparent_65%)] blur-2xl"
        animate={{ x: [0, -30, 0], y: [0, -22, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[30%] top-[10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(150,180,200,0.10),transparent_65%)] blur-2xl"
        animate={{ x: [0, 40, 0], y: [0, 40, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* rotating light rays */}
      <motion.div
        className="absolute inset-0 bg-[conic-gradient(from_0deg_at_64%_40%,transparent,rgba(194,163,95,0.07)_8%,transparent_16%,transparent,rgba(150,180,200,0.05)_58%,transparent_66%)]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      {/* fine grid shimmer */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:64px_64px]" />
      {/* drifting dust */}
      <div className="absolute inset-0">
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
      <div className="absolute right-[9%] top-1/2 hidden -translate-y-1/2 lg:block">
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
    </div>
  );
}
