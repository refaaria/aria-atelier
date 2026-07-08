"use client";

import { motion } from "motion/react";

const specks = [
  { l: "8%", t: "18%", s: 3, d: 0, dur: 10 },
  { l: "24%", t: "62%", s: 2, d: 1.4, dur: 12 },
  { l: "40%", t: "30%", s: 3, d: 0.8, dur: 11 },
  { l: "58%", t: "72%", s: 2, d: 2.1, dur: 13 },
  { l: "70%", t: "24%", s: 3, d: 1.0, dur: 10.5 },
  { l: "84%", t: "58%", s: 2, d: 0.4, dur: 12.5 },
  { l: "92%", t: "36%", s: 3, d: 1.8, dur: 11.5 },
  { l: "16%", t: "84%", s: 2, d: 2.4, dur: 9.8 },
];

/**
 * Subtle animated backdrop for interior pages. Place as the first child of a
 * `relative` container; it sits behind content via a negative z-index.
 */
export function Ambient({ tone = "gold", accent }: { tone?: "gold" | "steel"; accent?: string }) {
  const glow = accent
    ? `${accent}26`
    : tone === "steel"
      ? "rgba(150,180,200,0.10)"
      : "rgba(194,163,95,0.12)";
  const glow2 = accent
    ? `${accent}16`
    : tone === "steel"
      ? "rgba(194,163,95,0.08)"
      : "rgba(120,90,40,0.10)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute right-[-14%] top-[-6%] h-[640px] w-[640px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${glow}, transparent 62%)` }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[-16%] bottom-[-10%] h-[560px] w-[560px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${glow2}, transparent 65%)` }}
        animate={{ x: [0, -30, 0], y: [0, -22, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-[conic-gradient(from_200deg_at_50%_30%,transparent,rgba(194,163,95,0.04),transparent_45%)]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      {specks.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold/40"
          style={{ left: p.l, top: p.t, width: p.s, height: p.s }}
          animate={{ y: [0, -24, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.dur, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
