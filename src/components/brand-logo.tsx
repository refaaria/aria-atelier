"use client";

import { motion } from "motion/react";
import { brands, type BrandId } from "@/data/watches";
import { cn } from "@/lib/utils";

/** A single brand logo rendered as an elegant monochrome silhouette (CSS mask). */
export function BrandLogo({
  brandId,
  className,
  color = "#e8e2d0",
}: {
  brandId: BrandId | string;
  className?: string;
  color?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("block", className)}
      style={{
        WebkitMaskImage: `url(/logos/${brandId}.svg)`,
        maskImage: `url(/logos/${brandId}.svg)`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        backgroundColor: color,
      }}
    />
  );
}

/** Faint scattered brand logos drifting in the background. */
const scatter = [
  { id: "rolex", l: "6%", t: "16%", w: 150, d: 0, dur: 26, rot: -8 },
  { id: "omega", l: "78%", t: "10%", w: 120, d: 2, dur: 30, rot: 6 },
  { id: "patek-philippe", l: "60%", t: "62%", w: 170, d: 1, dur: 34, rot: -4 },
  { id: "cartier", l: "12%", t: "68%", w: 130, d: 3, dur: 28, rot: 5 },
  { id: "audemars-piguet", l: "40%", t: "26%", w: 110, d: 1.5, dur: 32, rot: -6 },
  { id: "jaeger-lecoultre", l: "84%", t: "74%", w: 160, d: 2.5, dur: 36, rot: 4 },
  { id: "omega", l: "26%", t: "88%", w: 100, d: 0.8, dur: 29, rot: -3 },
  { id: "rolex", l: "90%", t: "40%", w: 90, d: 3.4, dur: 31, rot: 7 },
] as const;

export function LogoField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      {scatter.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: s.l, top: s.t }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.03, 0.08, 0.03], y: [0, -22, 0], rotate: [s.rot, s.rot + 3, s.rot] }}
          transition={{ duration: s.dur, delay: s.d, repeat: Infinity, ease: "easeInOut" }}
        >
          <BrandLogo brandId={s.id} className="h-16" color="#f4f1ea" />
          <div style={{ width: s.w }} />
        </motion.div>
      ))}
    </div>
  );
}

/** A continuously scrolling row of brand logos. */
export function LogoMarquee({ className }: { className?: string }) {
  const row = [...brands, ...brands];
  return (
    <div aria-hidden className={cn("relative flex overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <motion.div
        className="flex shrink-0 items-center gap-20 pr-20"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {row.map((b, i) => (
          <BrandLogo key={`${b.id}-${i}`} brandId={b.id} className="h-8 w-40 opacity-40 transition-opacity hover:opacity-90" />
        ))}
      </motion.div>
    </div>
  );
}
