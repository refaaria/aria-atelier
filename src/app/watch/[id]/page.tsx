import { notFound } from "next/navigation";
import { WatchDetail } from "@/components/watch-detail";
import { brandById, watchById, watches } from "@/data/watches";

export function generateStaticParams() {
  return watches.map((w) => ({ id: w.id }));
}

export async function generateMetadata(props: PageProps<"/watch/[id]">) {
  const { id } = await props.params;
  const watch = watchById(id);
  if (!watch) return { title: "Timepiece — Aria's Atelier" };
  const brand = brandById(watch.brandId);
  return {
    title: `${brand?.name} ${watch.name} — Aria's Atelier`,
    description: watch.blurb,
  };
}

export default async function WatchPage(props: PageProps<"/watch/[id]">) {
  const { id } = await props.params;
  const watch = watchById(id);
  if (!watch) notFound();
  return <WatchDetail watch={watch} />;
}
