import type { Metadata } from "next";
import { CatalogEditor } from "../../../components/CatalogEditor";
import { readCatalog } from "../../../lib/catalog";
import { readContent } from "../../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Catalog" };

export default async function Page() {
  const [catalog, content] = await Promise.all([readCatalog(), readContent()]);
  return <CatalogEditor initial={catalog} materialOptions={content.site.collectionsPage.materials} />;
}
