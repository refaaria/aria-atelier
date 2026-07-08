import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import { WatchCard } from "@/components/watch-card";
import { WatchVisual } from "@/components/watch-visual";
import { LogoMarquee } from "@/components/brand-logo";
import { Reveal, Stagger, StaggerItem, GoldButton, Overline } from "@/components/motion-primitives";
import { brands, signaturePieces, watchById } from "@/data/watches";

const stats = [
  { value: "Est. 2026", label: "The House" },
  { value: "6", label: "Legendary Maisons" },
  { value: "36+", label: "Curated Timepieces" },
];

const galleryPreview = ["rolex-datejust-41", "patek-nautilus-5711", "cartier-santos-large"]
  .map((id) => watchById(id))
  .filter(Boolean);

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* Maisons strip — running logos */}
      <section className="border-y border-gold/12 bg-ink py-12">
        <Reveal>
          <LogoMarquee className="mx-auto max-w-[1400px]" />
        </Reveal>
      </section>

      {/* The Maison — cream */}
      <section className="bg-cream text-ink">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-28 md:grid-cols-2 md:px-10 md:py-36">
          <Reveal>
            <Overline className="text-gold-deep">The Maison</Overline>
            <h2 className="mt-6 max-w-md font-serif text-4xl leading-tight text-ink md:text-5xl">
              A Boutique of Exceptional Timepieces
            </h2>
            <div className="mt-8 h-px w-16 bg-ink/30" />
          </Reveal>
          <Reveal delay={0.15} className="space-y-6 text-[15px] leading-relaxed text-ink/70">
            <p>
              Aria&apos;s Atelier was founded on a simple belief: that a great watch is not bought,
              it is met. Within our private salon in Banjarbaru, each timepiece — from the Rolex
              Submariner to the Cartier Tank — is sourced, authenticated and presented one collector
              at a time.
            </p>
            <p>
              We keep our collection deliberately small. Six maisons. A few dozen references.
              Nothing in the vitrine that we would not wear ourselves.
            </p>
            <p className="font-display text-xl italic text-ink/80">— Refa Aria, Founder</p>
          </Reveal>
        </div>
      </section>

      {/* Signature Pieces */}
      <section className="bg-ink py-28 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <Reveal className="text-center">
            <Overline>The Collection</Overline>
            <h2 className="mt-5 font-serif text-4xl text-[#f6f2e9] md:text-5xl">Signature Pieces</h2>
          </Reveal>

          <Stagger className="mt-16 grid gap-6 md:grid-cols-3" gap={0.14}>
            {signaturePieces.map((w, i) => (
              <WatchCard key={w.id} watch={w} cta="Discover" index={i} />
            ))}
          </Stagger>

          <Reveal className="mt-14 flex justify-center" delay={0.1}>
            <GoldButton href="/maisons" variant="outline">
              View the Full Catalogue
            </GoldButton>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gold/12 bg-ink-2 py-16">
        <Stagger className="mx-auto grid max-w-[1000px] grid-cols-1 gap-10 px-6 text-center sm:grid-cols-3">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <div className="font-serif text-4xl text-gold md:text-5xl">{s.value}</div>
              <div className="mt-3 overline text-[#f4f1ea]/50">{s.label}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Gallery preview — cream */}
      <section className="bg-cream text-ink">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 py-28 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-32">
          <Reveal>
            <Overline className="text-gold-deep">The Gallery</Overline>
            <h2 className="mt-6 font-serif text-4xl leading-tight text-ink md:text-5xl">
              Inside the Atelier
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/65">
              Step into our private salon and view the collection in person, under the light it was
              made for.
            </p>
            <div className="mt-9">
              <GoldButton href="/gallery">Visit the Gallery</GoldButton>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-3 gap-4" gap={0.12}>
            {galleryPreview.map(
              (w) =>
                w && (
                  <StaggerItem key={w.id}>
                    <Link
                      href={`/watch/${w.id}`}
                      className="group flex aspect-[4/5] items-center justify-center overflow-hidden border border-ink/10 bg-ink transition-colors hover:border-gold/50"
                    >
                      <div className="transition-transform duration-700 group-hover:scale-105">
                        <WatchVisual watch={w} size={172} float={false} />
                      </div>
                    </Link>
                  </StaggerItem>
                ),
            )}
          </Stagger>
        </div>
      </section>

      {/* Invitation */}
      <section className="bg-ink py-24 text-center">
        <Reveal>
          <div className="relative mx-auto mb-10 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40">
            <span className="absolute -inset-2 rounded-full border border-dashed border-gold/25 [animation:spin_26s_linear_infinite]" />
            <span className="font-serif text-2xl text-gold">A</span>
          </div>
          <p className="mx-auto max-w-xl px-6 font-display text-2xl italic text-[#f4f1ea]/75 md:text-3xl">
            &ldquo;A fine watch is a small kingdom on the wrist.&rdquo;
          </p>
          <Link
            href="/contact"
            className="group mt-8 inline-flex items-center gap-2 overline text-gold"
          >
            Begin a Conversation
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1.5" />
          </Link>
        </Reveal>
      </section>

      {/* subtle campus-project disclaimer */}
      <div className="bg-ink pb-12 text-center">
        <p className="mx-auto max-w-2xl px-6 text-[11px] leading-relaxed text-[#f4f1ea]/25">
          A student concept project made for a campus assignment. Aria&apos;s Atelier is fictitious
          and is not affiliated with, endorsed by, or connected to any watch manufacturer — all
          brand names and trademarks belong to their respective owners.
        </p>
      </div>
    </>
  );
}
