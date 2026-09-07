export type CmsPayload = Record<string, string | number | boolean | Record<string, string>>;

const queries: Record<string, string> = {
  sections: "deleted_at=is.null&order=sort_order.asc",
  products: "deleted_at=is.null&order=created_at.desc",
  product_categories: "deleted_at=is.null&order=sort_order.asc",
  projects: "deleted_at=is.null&order=created_at.desc",
  media: "deleted_at=is.null&order=created_at.desc",
  enquiries: "deleted_at=is.null&order=created_at.desc",
  testimonials: "deleted_at=is.null&order=sort_order.asc",
  navigation_items: "deleted_at=is.null&order=sort_order.asc",
  website_settings: "order=id.asc",
  seo_settings: "order=id.asc",
};

export function queryFor(table: string) {
  return queries[table] ?? "";
}

export function payloadFor(table: string, form: FormData): CmsPayload {
  const name = String(form.get("name") || "Untitled");
  const status = String(form.get("status") || "draft");
  const description = String(form.get("description") || "");
  const slug = slugify(name);

  switch (table) {
    case "products":
      return { name, slug, code: String(form.get("code") || `FL-${Date.now().toString().slice(-4)}`), description, status };
    case "product_categories":
      return { name, slug, description };
    case "projects":
      return { title: name, slug, description, status };
    case "sections":
      return { type: "content", title: name, description, status };
    case "testimonials":
      return { name, quote: description, status };
    case "navigation_items":
      return { label: name, url: description || "/", visible: status === "published" };
    case "website_settings":
    case "seo_settings":
      return { data: { title: name, description } };
    default:
      return { title: name, description, status };
  }
}

export function canCreate(table: string) {
  return !["enquiries", "media", "website_settings", "seo_settings"].includes(table);
}

export function canReorder(table: string) {
  return ["sections", "product_categories", "testimonials", "navigation_items"].includes(table);
}

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
