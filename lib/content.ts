import { readFile } from "node:fs/promises";
import path from "node:path";
import { withSiteDefaults, type About, type Content } from "./site-content";

export * from "./site-content";

const FILE = path.join(process.cwd(), "data", "content.json");

export async function readContent(): Promise<Content> {
  const data = JSON.parse(await readFile(FILE, "utf8")) as Partial<Content>;
  return {
    about: data.about as About,
    testimonials: data.testimonials || [],
    projects: data.projects || [],
    site: withSiteDefaults(data.site),
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
