"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StaggerItem } from "@/components/motion-primitives";
import { WatchVisual } from "@/components/watch-visual";
import { BrandLogo } from "@/components/brand-logo";
import type { Brand, Watch } from "@/data/watches";

export function MaisonCard({ brand, watch, count }: { brand: Brand; watch?: Watch; count: number }) {
  return (
    <StaggerItem>
      <Link
        href={`/maisons/${brand.id}`}
        className="surface-card sheen group relative flex h-full flex-col items-center overflow-hidden border border-gold/12 px-8 py-12 text-center hover:-translate-y-2 hover:border-gold/45"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(194,163,95,0.12),transparent_65%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        {/* logo (default) → watch photo (hover) */}
        <div className="relative flex h-56 w-full items-center justify-center">
          <div className="pointer-events-none absolute h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(194,163,95,0.14),transparent_68%)] blur-xl" />
          <div className="absolute flex items-center justify-center transition-all duration-500 group-hover:scale-90 group-hover:opacity-0">
            <BrandLogo brandId={brand.id} className="h-16 w-44" />
          </div>
          {watch && (
            <div className="absolute scale-90 opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100">
              <WatchVisual watch={watch} size={200} float={false} />
            </div>
          )}
        </div>

        <h2 className="relative mt-2 font-serif text-2xl text-[#f6f2e9]">{brand.name}</h2>
        <p className="relative mt-2 text-sm text-[#f4f1ea]/45">{brand.line}</p>

        <div className="rule-gold relative my-5 w-12 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-20" />
        <div className="relative overline text-[#f4f1ea]/45">{count} Timepieces</div>

        <div className="relative mt-6 inline-flex items-center gap-2 overline text-gold">
          View Collection
          <ArrowRight size={13} className="transition-transform duration-500 group-hover:translate-x-1.5" />
        </div>
      </Link>
    </StaggerItem>
  );
}
