import type { Metadata } from "next";
import { CatalogEditor } from "../../../components/CatalogEditor";
import { readCatalog } from "../../../lib/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Catalog" };

export default async function Page() {
  const catalog = await readCatalog();
  return <CatalogEditor initial={catalog} />;
}
