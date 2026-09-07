import { readFile } from "node:fs/promises";
import path from "node:path";

export type CatalogProduct = { id: string; image: string; visible: boolean; name?: string };
export type CatalogCategory = {
  id: string;
  name: string;
  hero: string;
  visible: boolean;
  products: CatalogProduct[];
};
export type Catalog = { categories: CatalogCategory[] };

const FILE = path.join(process.cwd(), "data", "catalog.json");

export async function readCatalog(): Promise<Catalog> {
  const raw = await readFile(FILE, "utf8");
  const data = JSON.parse(raw) as Catalog;
  if (!data || !Array.isArray(data.categories)) return { categories: [] };
  return data;
}

/** Only visible categories and visible products — for the public site. */
export async function publicCatalog(): Promise<Catalog> {
  const data = await readCatalog();
  return {
    categories: data.categories
      .filter((c) => c.visible)
      .map((c) => ({ ...c, products: c.products.filter((p) => p.visible) }))
      .filter((c) => c.products.length > 0),
  };
}

export async function getPublicCategory(slug: string): Promise<CatalogCategory | null> {
  const { categories } = await publicCatalog();
  return categories.find((c) => c.id === slug) ?? null;
}
