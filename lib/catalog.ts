import { readFile } from "node:fs/promises";
import path from "node:path";
import { sbReadable, sbGet } from "./supabase-server";

export type CatalogProduct = {
  id: string;
  image: string;
  visible: boolean;
  name?: string;
  model?: string;
  description?: string;
};
export type CatalogCategory = {
  id: string;
  name: string;
  hero: string;
  visible: boolean;
  products: CatalogProduct[];
};
export type Catalog = { categories: CatalogCategory[] };

/** A product together with the category it belongs to. */
export type ProductWithCategory = {
  product: CatalogProduct;
  category: CatalogCategory;
};

const FILE = path.join(process.cwd(), "data", "catalog.json");

function normalise(data: unknown): Catalog {
  if (!data || !Array.isArray((data as Catalog).categories)) return { categories: [] };
  return data as Catalog;
}

export async function readCatalog(): Promise<Catalog> {
  if (sbReadable) {
    const stored = await sbGet("catalog");
    if (stored) return normalise(stored);
  }
  try {
    return normalise(JSON.parse(await readFile(FILE, "utf8")));
  } catch {
    return { categories: [] };
  }
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

/** Find one visible product (and its category) by product id, across all categories. */
export async function getPublicProduct(id: string): Promise<ProductWithCategory | null> {
  const { categories } = await publicCatalog();
  for (const category of categories) {
    const product = category.products.find((p) => p.id === id);
    if (product) return { product, category };
  }
  return null;
}

/** A readable label for a product, falling back to the model or category name. */
export function productLabel(p: CatalogProduct, category?: { name: string }): string {
  return p.name || p.model || (category ? `${category.name} design` : "Product");
}
