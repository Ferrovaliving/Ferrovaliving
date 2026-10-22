import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";
import { CollectionGrid } from "../../../components/CollectionGrid";
import { getPublicCategory, productLabel } from "../../../lib/catalog";
import { publicContent } from "../../../lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getPublicCategory(slug);
  if (!cat) return { title: "Collection" };
  const description = `${cat.name} by Ferrova Living — ${cat.products.length} weather-grade ${cat.name.toLowerCase()} designs, made to measure in Udaipur for hotels, resorts, villas and homes.`;
  return {
    title: cat.name,
    description,
    alternates: { canonical: `/collections/${cat.id}` },
    openGraph: { title: `${cat.name} · Ferrova Living`, description, images: [{ url: cat.hero }] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getPublicCategory(slug);
  if (!cat) notFound();
  const { site } = await publicContent();

  return (
    <main>
      <SiteHeader />

      <section className="productsBanner">
        <div
          className="productsBannerImg"
          style={{ backgroundImage: `url(${JSON.stringify(cat.hero)})` }}
        />
        <div className="productsBannerShade" />
        <div>
          <h1>{cat.name}</h1>
          <p>Home · Collections · {cat.name}</p>
        </div>
      </section>

      <section className="section productsSection">
        <p className="catalogIntro">{site.collectionDetail.intro}</p>
        {cat.products.length === 0 && (
          <p className="catalogIntro">
            Pieces for this collection are being photographed. Enquire and we&rsquo;ll share the latest designs
            and made-to-order options.
          </p>
        )}
        <CollectionGrid
          items={cat.products.map((p) => ({
            id: p.id,
            image: p.image,
            name: productLabel(p, cat),
            model: p.model,
            materials: p.materials || [],
          }))}
          materialOrder={site.collectionsPage.materials}
        />
        <div className="center">
          <Link className="darkButton" href="/#contact">Enquire about this collection <b>↗</b></Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
