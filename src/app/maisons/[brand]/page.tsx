import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { brandById, brands, watchesByBrand } from "@/data/watches";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.id }));
}

export async function generateMetadata(props: PageProps<"/maisons/[brand]">) {
  const { brand: brandId } = await props.params;
  const brand = brandById(brandId);
  return {
    title: brand ? `${brand.name} — Aria's Atelier` : "Maison — Aria's Atelier",
    description: brand?.line,
  };
}

export default async function CollectionPage(props: PageProps<"/maisons/[brand]">) {
  const { brand: brandId } = await props.params;
  const brand = brandById(brandId);
  if (!brand) notFound();

  const watches = watchesByBrand(brand.id);
  return <CollectionView brand={brand} watches={watches} />;
}
