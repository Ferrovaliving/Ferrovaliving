import type { Metadata } from "next";
import "./globals.css";
import { FloatingContact } from "../components/FloatingContact";
import { siteUrl, businessJsonLd } from "../lib/site";
import { publicContent } from "../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await publicContent();
  const { siteName, tagline, description, keywords } = site.seo;
  const titleDefault = `${siteName} — ${tagline}`;
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: titleDefault,
      template: `%s · ${siteName}`,
    },
    description,
    keywords,
    applicationName: siteName,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName,
      title: titleDefault,
      description,
      url: siteUrl,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = await businessJsonLd();
  return (
    <html lang="en">
      <body>
        {children}
        <FloatingContact />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
