import { publicContent } from "./content";

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  vercelUrl ||
  "https://ferrovaliving.com"
).replace(/\/$/, "");

/** LocalBusiness / FurnitureStore structured data for the whole site. */
export async function businessJsonLd() {
  const { site } = await publicContent();
  const c = site.contact;
  return {
    "@context": "https://schema.org",
    "@type": ["FurnitureStore", "LocalBusiness"],
    name: site.seo.siteName,
    description: site.seo.description,
    url: siteUrl,
    telephone: c.phoneDisplay,
    email: c.email,
    image: `${siteUrl}/hero.webp`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Udaipur",
      addressRegion: "Rajasthan",
      postalCode: "313001",
      addressCountry: "IN",
    },
    areaServed: "IN",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "21:00",
    },
    sameAs: [c.instagramUrl],
    slogan: site.seo.tagline,
  };
}
