import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  withSiteDefaults,
  type About,
  type Content,
  type Project,
  type Testimonial,
} from "./site-content";
import { sbReadable, sbGet } from "./supabase-server";

export * from "./site-content";

const FILE = path.join(process.cwd(), "data", "content.json");

async function readFileContent(): Promise<Partial<Content>> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Partial<Content>;
  } catch {
    return {};
  }
}

/**
 * Content comes from Supabase (`content_store`) when it's configured, falling
 * back per-key to data/content.json — so the site keeps working before anything
 * has been saved to the database. Without Supabase it's just the JSON file.
 */
export async function readContent(): Promise<Content> {
  const file = await readFileContent();

  if (sbReadable) {
    const [site, about, testimonials, projects] = await Promise.all([
      sbGet("site"),
      sbGet("about"),
      sbGet("testimonials"),
      sbGet("projects"),
    ]);
    return {
      about: (about as About) ?? (file.about as About),
      testimonials: (testimonials as Testimonial[]) ?? file.testimonials ?? [],
      projects: (projects as Project[]) ?? file.projects ?? [],
      site: withSiteDefaults((site as Content["site"]) ?? file.site),
    };
  }

  return {
    about: file.about as About,
    testimonials: file.testimonials ?? [],
    projects: file.projects ?? [],
    site: withSiteDefaults(file.site),
  };
}

/** Public view — visible testimonials/projects only. */
export async function publicContent(): Promise<Content> {
  const c = await readContent();
  return {
    ...c,
    testimonials: c.testimonials.filter((t) => t.visible),
    projects: c.projects.filter((p) => p.visible),
  };
}
