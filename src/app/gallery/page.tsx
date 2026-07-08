import Link from "next/link";
import { WatchVisual } from "@/components/watch-visual";
import { Reveal, Stagger, StaggerItem, GoldButton, Overline } from "@/components/motion-primitives";
import { Ambient } from "@/components/ambient";
import { watchById } from "@/data/watches";

export const metadata = {
  title: "Gallery — Aria's Atelier",
  description: "Moments from the salon — the pieces, the light, the craft.",
};

type Tile =
  | { kind: "watch"; id: string; span: string; light?: boolean }
  | { kind: "quote"; span: string };

const tiles: Tile[] = [
  { kind: "watch", id: "rolex-submariner-date", span: "md:col-span-7" },
  { kind: "watch", id: "cartier-santos-large", span: "md:col-span-5", light: true },
  { kind: "watch", id: "omega-seamaster-diver-300m", span: "md:col-span-4" },
  { kind: "quote", span: "md:col-span-4" },
  { kind: "watch", id: "ap-royal-oak-selfwinding-41", span: "md:col-span-4" },
  { kind: "watch", id: "patek-nautilus-5711", span: "md:col-span-6", light: true },
  { kind: "watch", id: "jlc-reverso-tribute-duoface", span: "md:col-span-6" },
];

export default function GalleryPage() {
  return (
    <div className="relative bg-ink pb-28 pt-36 md:pt-44">
      <Ambient />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal className="text-center">
          <Overline>The Gallery</Overline>
          <h1 className="mt-5 font-serif text-4xl text-[#f6f2e9] md:text-6xl">Inside the Atelier</h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] text-[#f4f1ea]/50">
            Moments from the salon — the pieces, the light, the craft.
          </p>
        </Reveal>

        <Stagger className="mt-16 grid auto-rows-[300px] gap-4 md:grid-cols-12 md:auto-rows-[340px]" gap={0.1}>
          {tiles.map((tile, i) => {
            if (tile.kind === "quote") {
              return (
                <StaggerItem key="quote" className={tile.span}>
                  <div className="flex h-full flex-col items-center justify-center border border-gold/15 bg-ink-2 px-6 text-center">
                    <p className="font-display text-3xl italic leading-tight text-[#f6f2e9]">
                      &ldquo;Craft in
                      <br />
                      every detail.&rdquo;
                    </p>
                    <div className="mt-6 h-px w-12 bg-gold/50" />
                  </div>
                </StaggerItem>
              );
            }
            const w = watchById(tile.id);
            if (!w) return null;
            return (
              <StaggerItem key={tile.id} className={tile.span}>
                <Link
                  href={`/watch/${w.id}`}
                  className={`group relative flex h-full items-center justify-center overflow-hidden border transition-colors duration-500 ${
                    tile.light
                      ? "border-black/10 bg-cream hover:border-gold"
                      : "border-gold/12 bg-ink-2 hover:border-gold/50"
                  }`}
                >
                  <div className="transition-transform duration-700 ease-out group-hover:scale-105">
                    <WatchVisual watch={w} size={210} float={false} />
                  </div>
                  <div
                    className={`absolute bottom-5 left-0 right-0 text-center overline ${
                      tile.light ? "text-ink/60" : "text-gold/70"
                    }`}
                  >
                    {w.name}
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="mt-16 flex justify-center" delay={0.1}>
          <GoldButton href="/contact">Arrange a Private Viewing</GoldButton>
        </Reveal>
      </div>
    </div>
  );
}
