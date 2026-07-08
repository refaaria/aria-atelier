import { Reveal, Stagger, Overline } from "@/components/motion-primitives";
import { Ambient } from "@/components/ambient";
import { MaisonCard } from "@/components/maison-card";
import { LogoField, LogoMarquee } from "@/components/brand-logo";
import { brands, watchesByBrand } from "@/data/watches";

export const metadata = {
  title: "Maisons — Aria's Atelier",
  description: "Six legendary maisons, each curated with devotion.",
};

export default function MaisonsPage() {
  return (
    <div className="relative overflow-hidden bg-ink pb-28 pt-36 md:pt-44">
      <Ambient />
      <LogoField />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal className="text-center">
          <Overline>The Catalogue</Overline>
          <h1 className="mt-5 font-serif text-4xl text-[#f6f2e9] md:text-6xl">
            Six Legendary Maisons
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] text-[#f4f1ea]/50">
            Choose a house to browse its curated timepieces and prices.
          </p>
        </Reveal>

        <Stagger className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.1}>
          {brands.map((b) => {
            const list = watchesByBrand(b.id);
            return <MaisonCard key={b.id} brand={b} watch={list[0]} count={list.length} />;
          })}
        </Stagger>

        <Reveal className="mt-24">
          <LogoMarquee className="mx-auto max-w-[1400px]" />
        </Reveal>

        <Reveal className="mt-20 text-center" delay={0.1}>
          <p className="font-display text-2xl italic text-[#f4f1ea]/70 md:text-3xl">
            &ldquo;A fine watch is a small kingdom on the wrist.&rdquo;
          </p>
          <div className="mt-4 overline text-gold/70">Private viewings by appointment</div>
        </Reveal>
      </div>
    </div>
  );
}
