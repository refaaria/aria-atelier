"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brandById, type Watch } from "@/data/watches";
import { formatPrice } from "@/lib/utils";
import { WatchVisual } from "@/components/watch-visual";

export function WatchCard({
  watch,
  cta = "View Details",
  index = 0,
}: {
  watch: Watch;
  cta?: string;
  index?: number;
}) {
  const brand = brandById(watch.brandId);
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 44 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className="group relative"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
    >
      <Link
        href={`/watch/${watch.id}`}
        className="surface-card sheen relative flex flex-col items-center overflow-hidden border border-gold/12 px-8 py-12 text-center hover:border-gold/45"
      >
        {/* hover glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(194,163,95,0.12),transparent_65%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        <motion.div
          className="relative"
          whileHover={{ scale: 1.05, y: -6 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          <WatchVisual watch={watch} size={220} />
        </motion.div>

        <div className="relative mt-4 overline text-gold/80">{brand?.name}</div>
        <h3 className="relative mt-3 font-serif text-2xl text-[#f6f2e9]">{watch.name}</h3>

        <div className="rule-gold relative my-5 w-12 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-20" />

        <div className="relative tabular-nums text-[#f4f1ea]/75">{formatPrice(watch.price)}</div>

        <div className="relative mt-6 inline-flex items-center gap-2 overline text-gold">
          {cta}
          <ArrowRight size={13} className="transition-transform duration-500 group-hover:translate-x-1.5" />
        </div>
      </Link>
    </motion.div>
  );
}
