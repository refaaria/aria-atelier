"use client";

import { motion } from "motion/react";
import { WatchVisual } from "@/components/watch-visual";
import type { Watch } from "@/data/watches";

/** A full watch on an animated, highlighted stage — uniform, large, elegant. */
export function WatchStage({
  watch,
  accent = "#c2a35f",
  size = 300,
  dashed = false,
}: {
  watch: Watch;
  accent?: string;
  size?: number;
  dashed?: boolean;
}) {
  return (
    <div className="relative flex aspect-square w-full max-w-md items-center justify-center">
      {/* pulsing accent glow */}
      <motion.div
        aria-hidden
        className="absolute inset-[6%] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle at 50% 45%, ${accent}3d, transparent 62%)` }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* slow rotating light beam */}
      <div aria-hidden className="absolute inset-[2%] overflow-hidden rounded-full opacity-50">
        <motion.div
          className="absolute -inset-1/2 bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.07)_9%,transparent_20%)]"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {/* rings */}
      <motion.span
        aria-hidden
        className="absolute inset-[4%] rounded-full border"
        style={{ borderColor: `${accent}2a` }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        aria-hidden
        className={`absolute inset-[-4%] rounded-full border ${dashed ? "border-dashed" : ""}`}
        style={{ borderColor: `${accent}1c` }}
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 72, repeat: Infinity, ease: "linear" }}
      />
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
        <WatchVisual watch={watch} size={size} glow={false} />
      </motion.div>
    </div>
  );
}
