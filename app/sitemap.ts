import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";
import { publicCatalog } from "../lib/catalog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes = ["", "/collections", "/products", "/projects", "/about", "/contact"].map((p) => ({
    url: `${siteUrl}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  let categories: MetadataRoute.Sitemap = [];
  try {
    const { categories: cats } = await publicCatalog();
    categories = cats.map((c) => ({
      url: `${siteUrl}/collections/${c.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    /* keep base routes only */
  }

  return [...routes, ...categories];
}
