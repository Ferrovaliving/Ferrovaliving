"use server";

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import type { Content, NavLink, IconItem, FaqItem, SiteContent } from "./content";
import { withSiteDefaults } from "./content";

const DATA = path.join(process.cwd(), "data", "content.json");
const UPLOADS = path.join(process.cwd(), "public", "uploads");

function assertEditable() {
  if (process.env.VERCEL) {
    throw new Error(
      "Editing is turned off on this hosting (read-only filesystem). Connect Supabase to manage content in production.",
    );
  }
}

const slug = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const str = (v: unknown, max: number) => String(v ?? "").slice(0, max);
const links = (v: NavLink[] | undefined): NavLink[] =>
  (v || [])
    .map((l) => ({ label: str(l?.label, 80), href: str(l?.href, 300) }))
    .filter((l) => l.label);
const iconItems = (v: IconItem[] | undefined): IconItem[] =>
  (v || [])
    .map((i) => ({ icon: str(i?.icon, 40), label: str(i?.label, 120) }))
    .filter((i) => i.label);

function sanitiseSite(raw: SiteContent): SiteContent {
  const s = withSiteDefaults(raw);
  return {
    nav: { links: links(s.nav.links), ctaLabel: str(s.nav.ctaLabel, 80), ctaHref: str(s.nav.ctaHref, 300) },
    hero: {
      eyebrow: str(s.hero.eyebrow, 160),
      headline: str(s.hero.headline, 240),
      accent: str(s.hero.accent, 120),
      intro: str(s.hero.intro, 600),
      ctaLabel: str(s.hero.ctaLabel, 80),
      ctaHref: str(s.hero.ctaHref, 300),
      scrollText: str(s.hero.scrollText, 80),
      image: str(s.hero.image, 400),
    },
    features: iconItems(s.features),
    collectionSection: {
      eyebrow: str(s.collectionSection.eyebrow, 120),
      heading: str(s.collectionSection.heading, 160),
      ctaLabel: str(s.collectionSection.ctaLabel, 80),
    },
    why: {
      eyebrow: str(s.why.eyebrow, 120),
      heading: str(s.why.heading, 160),
      intro: str(s.why.intro, 800),
      items: iconItems(s.why.items),
    },
    testimonialSection: {
      eyebrow: str(s.testimonialSection.eyebrow, 120),
      heading: str(s.testimonialSection.heading, 160),
    },
    projectSection: {
      eyebrow: str(s.projectSection.eyebrow, 120),
      heading: str(s.projectSection.heading, 160),
      ctaLabel: str(s.projectSection.ctaLabel, 80),
    },
    faq: {
      eyebrow: str(s.faq.eyebrow, 120),
      heading: str(s.faq.heading, 160),
      items: (s.faq.items || [])
        .map((f: FaqItem) => ({ q: str(f?.q, 300), a: str(f?.a, 2000) }))
        .filter((f) => f.q),
    },
    enquiry: {
      eyebrow: str(s.enquiry.eyebrow, 120),
      heading: str(s.enquiry.heading, 160),
      accent: str(s.enquiry.accent, 120),
      budgets: (s.enquiry.budgets || []).map((b) => str(b, 80)).filter(Boolean),
      success: str(s.enquiry.success, 400),
    },
    footer: { links: links(s.footer.links), copyright: str(s.footer.copyright, 300) },
    collectionsPage: {
      heading: str(s.collectionsPage.heading, 160),
      intro: str(s.collectionsPage.intro, 800),
    },
    collectionDetail: { intro: str(s.collectionDetail.intro, 800) },
    projectsPage: {
      heading: str(s.projectsPage.heading, 160),
      intro: str(s.projectsPage.intro, 800),
      empty: str(s.projectsPage.empty, 400),
    },
    productsPage: { intro: str(s.productsPage.intro, 800) },
    contact: {
      company: str(s.contact.company, 120),
      tagline: str(s.contact.tagline, 160),
      phoneDisplay: str(s.contact.phoneDisplay, 60),
      phoneDigits: str(s.contact.phoneDigits, 20).replace(/[^0-9]/g, ""),
      whatsappDigits: str(s.contact.whatsappDigits, 20).replace(/[^0-9]/g, ""),
      whatsappMessage: str(s.contact.whatsappMessage, 600),
      email: str(s.contact.email, 160),
      instagramHandle: str(s.contact.instagramHandle, 80),
      instagramUrl: str(s.contact.instagramUrl, 300),
      hours: str(s.contact.hours, 160),
      addressLine1: str(s.contact.addressLine1, 160),
      addressLine2: str(s.contact.addressLine2, 160),
    },
    seo: {
      siteName: str(s.seo.siteName, 120),
      tagline: str(s.seo.tagline, 160),
      description: str(s.seo.description, 400),
      keywords: (s.seo.keywords || []).map((k) => str(k, 80)).filter(Boolean),
    },
  };
}

function sanitise(next: Content): Content {
  const idFor = (raw: string, seen: Set<string>, prefix: string) => {
    let id = raw?.trim() || `${prefix}-${Math.random().toString(36).slice(2, 7)}`;
    while (seen.has(id)) id = `${id}-${Math.random().toString(36).slice(2, 4)}`;
    seen.add(id);
    return id;
  };
  const tSeen = new Set<string>();
  const pSeen = new Set<string>();
  return {
    about: {
      eyebrow: String(next.about?.eyebrow || "About Ferrova Living").slice(0, 120),
      headingLine1: String(next.about?.headingLine1 || "").slice(0, 120),
      headingLine2: String(next.about?.headingLine2 || "").slice(0, 120),
      intro: String(next.about?.intro || "").slice(0, 2000),
      body: (next.about?.body || []).map((p) => String(p).slice(0, 4000)).filter(Boolean),
      pageTitle: String(next.about?.pageTitle || "").slice(0, 200),
      pageEyebrow: String(next.about?.pageEyebrow || "").slice(0, 120),
      pageBody: (next.about?.pageBody || []).map((p) => String(p).slice(0, 4000)).filter(Boolean),
    },
    testimonials: (next.testimonials || []).map((t) => ({
      id: idFor(t.id, tSeen, "t"),
      quote: String(t.quote || "").slice(0, 2000),
      name: String(t.name || "").slice(0, 120),
      role: String(t.role || "").slice(0, 120),
      visible: t.visible !== false,
    })),
    projects: (next.projects || []).map((p) => ({
      id: idFor(p.id || slug(p.title || ""), pSeen, "p"),
      title: String(p.title || "Untitled project").slice(0, 160),
      location: String(p.location || "").slice(0, 120),
      kind: String(p.kind || "").slice(0, 120),
      summary: String(p.summary || "").slice(0, 4000),
      image: String(p.image || ""),
      visible: p.visible !== false,
    })),
    site: sanitiseSite(next.site),
  };
}

export async function loadContent(): Promise<Content> {
  return JSON.parse(await readFile(DATA, "utf8")) as Content;
}

export async function saveContent(next: Content): Promise<{ ok: true }> {
  assertEditable();
  const clean = sanitise(next);
  await writeFile(DATA, JSON.stringify(clean, null, 2) + "\n", "utf8");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function uploadContentImage(form: FormData): Promise<{ path: string }> {
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
