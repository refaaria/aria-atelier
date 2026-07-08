"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { WatchModel } from "@/components/watch-model";
import type { Watch } from "@/data/watches";
import { cn } from "@/lib/utils";

/**
 * Renders the real product photo for a timepiece (colours untouched) with an
 * elegant glow / float / spotlight, and falls back to the parametric 3D render
 * if the image is missing.
 */
export function WatchVisual({
  watch,
  size = 200,
  live = false,
  glow = true,
  float = true,
  ring = false,
  className,
}: {
  watch: Watch;
  size?: number;
  live?: boolean;
  glow?: boolean;
  float?: boolean;
  ring?: boolean;
  className?: string;
}) {
  const [err, setErr] = useState(false);
  const accent = watch.dialStyle.light ? "#c2a35f" : watch.dialStyle.dial;

  if (err) {
    return <WatchModel watch={watch} size={size} live={live} className={className} />;
  }

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {glow && (
        <div
          className="pointer-events-none absolute inset-[8%] -z-10 rounded-full blur-2xl"
          style={{ background: `radial-gradient(circle, ${accent}40, transparent 66%)` }}
        />
      )}
      {ring && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-full border"
            style={{ borderColor: `${accent}30` }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-[-8%] -z-10 rounded-full border border-dashed"
            style={{ borderColor: `${accent}22` }}
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}
      <motion.div
        className="relative h-full w-full"
        animate={float ? { y: [0, -10, 0] } : undefined}
        transition={float ? { duration: 7, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/watches/${watch.id}.png`}
          alt={`${watch.name} timepiece`}
          onError={() => setErr(true)}
          draggable={false}
          className="h-full w-full select-none object-contain [filter:drop-shadow(0_20px_30px_rgba(0,0,0,0.55))]"
        />
      </motion.div>
    </div>
  );
}
