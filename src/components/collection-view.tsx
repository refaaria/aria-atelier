"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Reveal, Stagger, GoldButton, Overline } from "@/components/motion-primitives";
import { Ambient } from "@/components/ambient";
import { WatchCard } from "@/components/watch-card";
import { BrandLogo } from "@/components/brand-logo";
import { brands, type Brand, type Watch } from "@/data/watches";

export function CollectionView({ brand, watches }: { brand: Brand; watches: Watch[] }) {
  return (
    <div className="relative bg-ink pb-28 pt-36 md:pt-44">
      <Ambient />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        {/* header */}
        <Reveal className="flex flex-col items-center text-center">
          <Overline>Maison</Overline>
          <BrandLogo brandId={brand.id} className="mt-6 h-16 w-56 md:h-20" />
          <h1 className="mt-6 font-serif text-4xl uppercase tracking-[0.06em] text-[#f6f2e9] md:text-6xl">
            {brand.name}
          </h1>
          <p className="mt-4 text-sm text-[#f4f1ea]/55">
            {brand.line} &nbsp;·&nbsp; {watches.length} timepieces
          </p>
        </Reveal>

        {/* maison tabs */}
        <Reveal delay={0.1} className="mt-10 flex flex-wrap justify-center gap-2.5">
          {brands.map((b) => {
            const active = b.id === brand.id;
            return (
              <Link
                key={b.id}
                href={`/maisons/${b.id}`}
                className="relative overflow-hidden border border-gold/25 px-4 py-2 overline transition-colors duration-300"
              >
                {active && (
                  <motion.span
                    layoutId="maison-tab"
                    className="absolute inset-0 bg-gold"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={active ? "relative text-ink" : "relative text-[#f4f1ea]/55 hover:text-gold"}>
                  {b.name}
                </span>
              </Link>
            );
          })}
        </Reveal>

        {/* grid */}
        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.1}>
          {watches.map((w, i) => (
            <WatchCard key={w.id} watch={w} index={i} />
          ))}
        </Stagger>

        {/* cta */}
        <Reveal className="mt-24 text-center" delay={0.1}>
          <h2 className="font-serif text-3xl text-[#f6f2e9] md:text-4xl">
            Interested in a {brand.name} timepiece?
          </h2>
          <div className="mt-8 flex justify-center">
            <GoldButton href="/contact">Enquire the Boutique</GoldButton>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
