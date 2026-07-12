"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { GoldButton, EASE, Reveal, Overline, useRevealVisible } from "@/components/motion-primitives";
import { Ambient } from "@/components/ambient";
import { brandById, type Watch } from "@/data/watches";
import { WatchVisual } from "@/components/watch-visual";
import { WatchCanvas } from "@/components/three/watch-canvas";
import { WatchStage } from "@/components/watch-stage";
import { formatPrice } from "@/lib/utils";

export function WatchDetail({ watch }: { watch: Watch }) {
  const brand = brandById(watch.brandId);
  const accent = watch.dialStyle.light ? "#c2a35f" : watch.dialStyle.dial;

  const foldRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: foldRef, offset: ["start start", "end start"] });
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(900);
  useEffect(() => {
    const on = () => setVh(window.innerHeight);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  const foldWatchY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const foldWatchScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const foldFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const miniOpacity = useTransform(scrollY, [vh * 0.5, vh * 0.85], [0, 1]);
  const markY = useTransform(scrollY, [0, vh * 5], [0, -360]);

  const [docked, setDocked] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setDocked(v > vh * 0.6));

  const toOrder = () =>
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const specRef = useRef<HTMLDListElement>(null);
  const specVisible = useRevealVisible(specRef, 0.15);

  const specs = [
    { label: "Reference", value: watch.reference },
    { label: "Case", value: watch.specs.case },
    { label: "Movement", value: watch.specs.movement },
    { label: "Water Resistance", value: watch.specs.water },
    { label: "Bracelet", value: watch.specs.bracelet },
  ];

  return (
    <div className="relative overflow-hidden bg-ink">
      <Ambient accent={accent} />

      {/* following brand watermark */}
      <motion.div aria-hidden style={{ y: markY }} className="pointer-events-none fixed inset-x-0 top-1/2 z-0 -translate-y-1/2 text-center">
        <span className="font-serif text-[20vw] uppercase leading-none tracking-tight text-[#f6f2e9] opacity-[0.03]">{brand?.name}</span>
      </motion.div>

      {/* clickable follow watch → smooth-scroll to order */}
      <motion.button
        type="button"
        onClick={toOrder}
        style={{ opacity: miniOpacity }}
        className={`group fixed bottom-6 right-6 z-[6] hidden lg:block ${docked ? "cursor-pointer" : "pointer-events-none"}`}
        aria-label="Scroll to order"
      >
        <div className="relative">
          <div className="absolute left-1/2 top-1/2 -z-10 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(8,8,7,0.92),transparent_70%)] blur-lg" />
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{ borderColor: `${accent}80` }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <WatchVisual watch={watch} size={104} glow float className="transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap overline text-[0.55rem] text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">Order ↓</span>
        </div>
      </motion.button>

      {/* -------------------------------------------- fold -------------------------------------------- */}
      <section ref={foldRef} className="relative flex min-h-screen items-center pt-28">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.05, scale: 1 }}
            transition={{ duration: 2, ease: EASE }}
            className="whitespace-nowrap font-serif text-[22vw] uppercase leading-none tracking-tight text-[#f6f2e9]"
          >
            {brand?.name}
          </motion.span>
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 md:px-10 lg:grid-cols-2">
          <motion.div style={{ y: foldWatchY, scale: foldWatchScale }} className="flex flex-col items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.3, ease: EASE }} className="w-full">
              <WatchCanvas watch={watch} tilt={0.28} className="mx-auto h-[440px] w-full max-w-[520px] sm:h-[520px]" />
            </motion.div>
            <motion.div
              className="pointer-events-none -mt-4 overline text-[0.58rem] text-gold/70"
              animate={{ opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Drag to explore
            </motion.div>
          </motion.div>

          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}>
              <div className="overline" style={{ color: accent }}>{brand?.name}</div>
              <h1 className="mt-4 font-serif text-5xl leading-[1.02] text-[#f6f2e9] md:text-7xl">{watch.name}</h1>
              <div className="mt-6 overline text-[#f4f1ea]/45">{watch.tagline}</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: EASE }} className="mt-10 flex items-end gap-4">
              <div className="font-serif text-4xl tabular-nums text-[#f6f2e9]">{formatPrice(watch.price)}</div>
              <div className="pb-1.5 text-xs text-[#f4f1ea]/40">approx. retail</div>
            </motion.div>

            <motion.div style={{ opacity: foldFade }} className="mt-14 flex items-center gap-3 overline text-[#f4f1ea]/40">
              <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                <ChevronDown size={14} style={{ color: accent }} />
              </motion.span>
              Scroll to explore &amp; enquire
            </motion.div>
          </div>
        </div>
      </section>

      {/* character + showcase (dark) */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        <section className="mx-auto max-w-3xl py-24 text-center md:py-32">
          <Reveal>
            <Overline>The Character</Overline>
            <p className="mt-8 font-serif text-2xl leading-[1.5] text-[#f6f2e9] md:text-[2.1rem]">{watch.blurb}</p>
          </Reveal>
        </section>

        <section className="pb-8 md:pb-16">
          <Reveal className="text-center">
            <Overline style={{ color: accent }}>In Motion</Overline>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <div className="relative mx-auto flex aspect-square max-w-4xl items-center justify-center overflow-hidden rounded-sm border border-white/10 sm:aspect-[16/10]" style={{ background: `radial-gradient(circle at 50% 40%, ${accent}22, #0a0908 62%)` }}>
              <motion.div aria-hidden className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent" animate={{ x: ["-60%", "360%"] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }} />
              {[15, 32, 54, 70, 86].map((l, i) => (
                <motion.span key={l} className="absolute rounded-full bg-white/40" style={{ left: `${l}%`, top: `${20 + (i * 13) % 60}%`, width: 2 + (i % 2), height: 2 + (i % 2) }} animate={{ y: [0, -18, 0], opacity: [0, 0.8, 0] }} transition={{ duration: 6 + i, delay: i * 0.7, repeat: Infinity, ease: "easeInOut" }} />
              ))}
              <WatchCanvas
                watch={watch}
                interactive={false}
                autoRotate
                tilt={0.24}
                className="h-full w-full"
              />
              <div className="absolute bottom-5 left-0 right-0 text-center overline text-white/50">{watch.name} · In Motion</div>
            </div>
          </Reveal>
        </section>
      </div>

      {/* specification — CREAM contrast section */}
      <section className="relative z-10 bg-cream py-24 text-ink md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal className="text-center">
            <Overline className="text-gold-deep">Specification</Overline>
            <h2 className="mt-5 font-serif text-4xl text-ink md:text-5xl">The Details</h2>
          </Reveal>
          <motion.dl ref={specRef} initial="hidden" animate={specVisible ? "visible" : "hidden"} variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="mt-14">
            {specs.map((s) => (
              <motion.div key={s.label} variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }} className="flex items-center justify-between border-t border-ink/15 py-6">
                <dt className="overline text-ink/45">{s.label}</dt>
                <dd className="text-right font-serif text-lg text-ink md:text-xl">{s.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* full-watch feature sections on an animated highlight stage */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        {/* the movement */}
        <section className="grid items-center gap-12 py-20 md:grid-cols-2 md:gap-20 md:py-28">
          <Reveal className="order-2 md:order-1">
            <Overline style={{ color: accent }}>The Movement</Overline>
            <h3 className="mt-5 font-serif text-3xl text-[#f6f2e9] md:text-5xl">{watch.specs.movement}</h3>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#f4f1ea]/55">
              At the heart of the {watch.name} beats a movement assembled, regulated and finished by
              hand — a mechanism engineered to keep faithful time for a lifetime and the generation
              that follows.
            </p>
            <div className="mt-8 h-px w-16" style={{ background: `${accent}80` }} />
          </Reveal>
          <Reveal className="order-1 flex justify-center md:order-2" delay={0.12}>
            <WatchStage watch={watch} accent={accent} />
          </Reveal>
        </section>

        {/* the case & bracelet */}
        <section className="grid items-center gap-12 py-20 md:grid-cols-2 md:gap-20 md:py-28">
          <Reveal className="flex justify-center">
            <WatchStage watch={watch} accent={accent} dashed />
          </Reveal>
          <Reveal delay={0.12}>
            <Overline style={{ color: accent }}>The Case &amp; Bracelet</Overline>
            <h3 className="mt-5 font-serif text-3xl text-[#f6f2e9] md:text-5xl">{watch.specs.case}</h3>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#f4f1ea]/55">
              Shaped, brushed and polished to the codes of {brand?.name}, water resistant to{" "}
              {watch.specs.water} and finished on {watch.specs.bracelet.toLowerCase()} — presence you
              feel before you read the hour.
            </p>
            <div className="mt-8 h-px w-16" style={{ background: `${accent}80` }} />
          </Reveal>
        </section>
      </div>

      {/* -------------------------------------------- order -------------------------------------------- */}
      <section id="order" className="relative z-10 overflow-hidden border-t border-white/10 py-28 text-center md:py-40">
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(circle at 50% 40%, ${accent}26, transparent 60%)` }} />
        <Reveal className="relative">
          <Overline style={{ color: accent }}>Acquire</Overline>
          <h2 className="mx-auto mt-6 max-w-2xl font-serif text-4xl leading-tight text-[#f6f2e9] md:text-6xl">Make the {watch.name} yours</h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] text-[#f4f1ea]/50">
            Reserve a private viewing or enquire about availability and current pricing — our
            concierge replies within one working day.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <GoldButton href="/contact">Enquire to Order</GoldButton>
            <GoldButton href={`/maisons/${watch.brandId}`} variant="outline">Back to {brand?.name}</GoldButton>
          </div>
          <p className="mx-auto mt-14 max-w-xl font-display text-xl italic text-[#f4f1ea]/60 md:text-2xl">
            &ldquo;A timepiece is not owned. It is kept, worn, and one day passed on.&rdquo;
          </p>
          <Link href="/gallery" className="group mt-10 inline-flex items-center gap-2 overline text-gold">
            View the Gallery
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1.5" />
          </Link>
          <p className="mx-auto mt-16 max-w-2xl text-sm text-[#f4f1ea]/35">Every timepiece is authenticated in-house and delivered with a two-year boutique guarantee.</p>
        </Reveal>
      </section>
    </div>
  );
}
