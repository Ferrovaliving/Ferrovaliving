import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";
import { getPublicProduct, publicCatalog, productLabel } from "../../../lib/catalog";
import { publicContent, whatsappUrl } from "../../../lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const found = await getPublicProduct(id);
  if (!found) return { title: "Product" };
  const { product, category } = found;
  const name = productLabel(product, category);
  const description =
    product.description ||
    `${name} by Ferrova Living — weather-grade ${category.name.toLowerCase()} made to measure in India.`;
  return {
    title: product.model ? `${name} (${product.model})` : name,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: { title: `${name} · Ferrova Living`, description, images: [{ url: product.image }] },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = await getPublicProduct(id);
  if (!found) notFound();
  const { product, category } = found;
  const { site } = await publicContent();

  const name = productLabel(product, category);
  const related = (await publicCatalog()).categories
    .find((c) => c.id === category.id)
    ?.products.filter((p) => p.id !== product.id)
    .slice(0, 4) ?? [];

  const waMessage = `Hi Ferrova Living, I'd like details on the ${name}${
    product.model ? ` (${product.model})` : ""
  }.`;

  return (
    <main>
      <SiteHeader />

      <section className="productDetail">
        <p className="crumbs">
          <Link href="/">Home</Link> · <Link href="/collections">Collections</Link> ·{" "}
          <Link href={`/collections/${category.id}`}>{category.name}</Link> · <span>{name}</span>
        </p>

        <div className="productDetail__grid">
          <figure className="productDetail__img">
            <img src={product.image} alt={name} />
          </figure>

          <div className="productDetail__info">
            <p className="eyebrow gold">{category.name}</p>
            <h1>{name}</h1>
            {product.model && <p className="productDetail__model">Model {product.model}</p>}
            {product.description && <p className="productDetail__desc">{product.description}</p>}

            <ul className="productDetail__specs">
              <li>Powder-coated metal frame, built for sun, rain and humidity</li>
              <li>Hand-woven rope and performance outdoor fabric</li>
              <li>Made to order — size, finish and upholstery can be tailored</li>
            </ul>

            <div className="productDetail__cta">
              <Link className="darkButton" href="/#contact">
                Enquire about this piece <b>↗</b>
              </Link>
              <a
                className="lightButton lightButton--dark"
                href={whatsappUrl(site.contact, waMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask on WhatsApp <b>↗</b>
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="productDetail__related">
            <h2>More in {category.name}</h2>
            <div className="collectionGrid">
              {related.map((p) => (
                <Link className="collectionItem" href={`/products/${p.id}`} key={p.id}>
                  <img src={p.image} alt={productLabel(p, category)} loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
