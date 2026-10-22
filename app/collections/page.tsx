import type { Metadata } from "next";
import { CategoryGroups } from "../../components/CategoryTiles";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { publicCatalog, splitByGroup } from "../../lib/catalog";
import { publicContent } from "../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Collections" };

export default async function Page() {
  const { categories } = await publicCatalog();
  const groups = splitByGroup(categories);
  const { site } = await publicContent();
  const { heading, intro } = site.collectionsPage;

  return (
    <main>
      <SiteHeader />

      <section className="productsBanner">
        <div className="productsBannerImg" />
        <div className="productsBannerShade" />
        <div>
          <h1>{heading}</h1>
          <p>Home · {heading}</p>
        </div>
      </section>

      <section className="section productsSection">
        <p className="catalogIntro">{intro}</p>
        <CategoryGroups
          type={groups.type}
          material={groups.material}
          typeHeading={site.collectionSection.typeHeading}
          materialHeading={site.collectionSection.materialHeading}
        />
      </section>

      <SiteFooter />
    </main>
  );
}
