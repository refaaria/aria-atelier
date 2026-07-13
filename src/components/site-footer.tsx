"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";

const explore = [
  { href: "/", label: "Home" },
  { href: "/maisons", label: "Maisons" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="relative z-[4] border-t border-gold/15 bg-ink/80">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
        <Reveal className="grid gap-14 md:grid-cols-[1.4fr_1fr_1.2fr_1.3fr]">
          <div>
            <div className="font-display text-2xl tracking-[0.2em] text-[#f6f2e9]">ARIA&apos;S ATELIER</div>
            <div className="mt-2 text-[0.55rem] uppercase tracking-[0.4em] text-gold/80">
              Haute Horlogerie — Banjarbaru
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-[#f4f1ea]/45">
              An intimate boutique of the world&apos;s finest timepieces, curated with devotion.
            </p>
          </div>

          <div>
            <div className="overline text-gold/80">Explore</div>
            <ul className="mt-5 space-y-3">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#f4f1ea]/60 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="overline text-gold/80">Visit Us</div>
            <address className="mt-5 space-y-1 text-sm not-italic leading-relaxed text-[#f4f1ea]/60">
              <p>Jl. Panglima Batur No. 11</p>
              <p>Banjarbaru, South Kalimantan</p>
              <p className="pt-2">+62 812 0000 0000</p>
              <p>concierge@ariasatelier.com</p>
            </address>
          </div>

          <div>
            <div className="overline text-gold/80">Newsletter</div>
            <form
              className="mt-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="w-full border border-gold/25 bg-transparent px-4 py-3 text-sm text-[#f4f1ea] placeholder:text-[#f4f1ea]/35 outline-none transition-colors focus:border-gold"
              />
              <button
                type="submit"
                className="group mt-4 inline-flex items-center gap-2 overline text-gold"
              >
                Subscribe
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </Reveal>

        <div className="mt-16 space-y-3 border-t border-gold/12 pt-8 text-center text-xs tracking-wide text-[#f4f1ea]/35">
          <p>
            © 2026 Aria&apos;s Atelier. Concept boutique — timepiece prices reflect approximate
            manufacturer retail and are indicative only.
          </p>
          <p className="mx-auto max-w-2xl text-[0.7rem] leading-relaxed text-[#f4f1ea]/30">
            A non-commercial student project for educational purposes. All watch images, brand
            names, and logos are the property of their respective owners and are used here for
            demonstration only. Not affiliated with or endorsed by any brand.
          </p>
        </div>
      </div>
    </footer>
  );
}
