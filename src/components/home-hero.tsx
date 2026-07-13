"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { GoldButton, EASE } from "@/components/motion-primitives";
import { WatchVisual } from "@/components/watch-visual";
import { watchById } from "@/data/watches";

function smoothToBottom() {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
}

const words = ["Time,", "Curated", "to", "Perfection."];
const heroWatch = watchById("rolex-submariner-date")!;

export function HomeHero() {
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(900);
  useEffect(() => {
    const on = () => setVh(window.innerHeight);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // The large hero watch is the scroll-linked sequence canvas (ScrollSequenceBg,
  // rendered behind this section). A small watch fades in pinned to the
  // bottom-right corner as you scroll, as a persistent "enquire" shortcut.
  const miniOpacity = useTransform(scrollY, [vh * 0.5, vh * 0.82], [0, 1]);
  const textY = useTransform(scrollY, [0, vh], [0, 90]);
  const textFade = useTransform(scrollY, [0, vh * 0.7], [1, 0]);

  const [docked, setDocked] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setDocked(v > vh * 0.6));

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-28">
      {/* The hero background is layered behind this transparent section:
          the looping video (z-1) + animated backdrop (z-2, SiteBackdrop) +
          the scroll-linked watch canvas (z-3, ScrollSequenceBg). */}

      {/* ---------- clickable follow watch, pinned bottom-right ---------- */}
      <motion.button
        type="button"
        onClick={smoothToBottom}
        style={{ opacity: miniOpacity }}
        className={`group fixed bottom-6 right-6 z-[6] hidden lg:block ${docked ? "cursor-pointer" : "pointer-events-none"}`}
        aria-label="Scroll to enquire"
      >
        <div className="relative">
          <div className="absolute left-1/2 top-1/2 -z-10 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(8,8,7,0.92),transparent_70%)] blur-lg" />
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/40"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <WatchVisual watch={heroWatch} size={104} glow float className="transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap overline text-[0.55rem] text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Enquire ↓
          </span>
        </div>
      </motion.button>

      {/* ---------- content ---------- */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 md:px-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div style={{ y: textY, opacity: textFade }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: EASE }} className="overline text-gold">
            Aria&apos;s Atelier — Haute Horlogerie
          </motion.div>

          <h1 className="mt-7 font-serif text-5xl leading-[1.08] tracking-tight text-[#f6f2e9] sm:text-6xl md:text-7xl">
            {words.map((w, i) => (
              <motion.span
                key={w}
                className="mr-[0.26em] inline-block"
                initial={{ opacity: 0, y: "0.5em", filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.4 + i * 0.12, ease: EASE }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1, ease: EASE }} className="mt-8 max-w-md text-[15px] leading-relaxed text-[#f4f1ea]/50">
            An intimate boutique of the world&apos;s finest timepieces. Rolex, Omega, Audemars
            Piguet, Cartier and beyond — each piece hand-selected, authenticated and presented
            with the reverence it deserves.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2, ease: EASE }} className="mt-10 flex flex-wrap gap-4">
            <GoldButton href="/maisons">Explore the Maisons</GoldButton>
            <GoldButton href="/gallery" variant="outline">Visit the Gallery</GoldButton>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div style={{ opacity: textFade }} className="absolute bottom-8 left-6 z-10 flex items-center gap-3 md:left-10">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="flex items-center gap-3 overline text-[#f4f1ea]/40">
          <ChevronDown size={14} className="text-gold" />
          Scroll
        </motion.div>
      </motion.div>
    </section>
  );
}
