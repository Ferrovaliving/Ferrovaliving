import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";
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
        <div className="collectionGrid collectionGrid--named">
          {cat.products.map((p, i) => (
            <Link className="collectionItem" href={`/products/${p.id}`} key={p.id + i}>
              <span className="collectionItem__img">
                <img src={p.image} alt={productLabel(p, cat)} loading="lazy" />
              </span>
              <span className="collectionItem__cap">
                <b>{productLabel(p, cat)}</b>
                {p.model && <em>{p.model}</em>}
              </span>
            </Link>
          ))}
        </div>
        <div className="center">
          <Link className="darkButton" href="/#contact">Enquire about this collection <b>↗</b></Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
