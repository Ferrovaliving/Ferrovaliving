import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { ProductGallery } from "../../components/ProductGallery";
import { publicCatalog } from "../../lib/catalog";
import { publicContent } from "../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "All Products" };

export default async function Page() {
  const { categories } = await publicCatalog();
  const { site } = await publicContent();
  const cats = categories.map((c) => ({ id: c.id, name: c.name }));
  const items = categories.flatMap((c) => c.products.map((p) => ({ image: p.image, catId: c.id })));

  return (
    <main>
      <SiteHeader />

      <section className="productsBanner">
        <div className="productsBannerImg" />
        <div className="productsBannerShade" />
        <div>
          <h1>All Products</h1>
          <p>Home · Products</p>
        </div>
      </section>

      <ProductGallery categories={cats} items={items} intro={site.productsPage.intro} />

      <SiteFooter />
    </main>
  );
}
