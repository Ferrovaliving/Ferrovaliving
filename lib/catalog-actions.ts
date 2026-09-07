"use server";

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import type { Catalog } from "./catalog";

const DATA = path.join(process.cwd(), "data", "catalog.json");
const UPLOADS = path.join(process.cwd(), "public", "uploads");

function assertEditable() {
  if (process.env.VERCEL) {
    throw new Error(
      "Catalog editing is turned off on this hosting (read-only filesystem). Connect Supabase to manage content in production.",
    );
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function sanitise(next: Catalog): Catalog {
  const seen = new Set<string>();
  const categories = (next.categories || []).map((c, ci) => {
    let id = slugify(c.id || c.name || `category-${ci + 1}`) || `category-${ci + 1}`;
    while (seen.has(id)) id = `${id}-${ci + 1}`;
    seen.add(id);
    const products = (c.products || []).map((p) => ({
      id: String(p.id || "").trim() || `item-${Math.random().toString(36).slice(2, 8)}`,
      image: String(p.image || ""),
      visible: p.visible !== false,
      ...(p.name ? { name: String(p.name) } : {}),
    }));
    return {
      id,
      name: String(c.name || "Untitled category").slice(0, 80),
      hero: String(c.hero || products[0]?.image || ""),
      visible: c.visible !== false,
      products,
    };
  });
  return { categories };
}

export async function loadCatalog(): Promise<Catalog> {
  return JSON.parse(await readFile(DATA, "utf8")) as Catalog;
}

export async function saveCatalog(next: Catalog): Promise<{ ok: true }> {
  assertEditable();
  const clean = sanitise(next);
  await writeFile(DATA, JSON.stringify(clean, null, 2) + "\n", "utf8");
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/products");
  for (const c of clean.categories) revalidatePath(`/collections/${c.id}`);
  return { ok: true };
}

export async function uploadCatalogImage(form: FormData): Promise<{ path: string }> {
  assertEditable();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("No image received.");
  if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) throw new Error("Use a JPG, PNG, WebP or AVIF image.");
  if (file.size > 25 * 1024 * 1024) throw new Error("Image must be 25 MB or smaller.");

  const buf = Buffer.from(await file.arrayBuffer());
  await mkdir(UPLOADS, { recursive: true });
  const base = (file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "image").slice(0, 40);
  const name = `${base || "image"}-${Date.now().toString(36)}.webp`;
  await sharp(buf)
    .rotate()
    .resize({ width: 1500, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(UPLOADS, name));

  return { path: `/uploads/${name}` };
}
