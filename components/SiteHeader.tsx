import Link from "next/link";
import { Logo } from "./Logo";
import { publicContent } from "../lib/content";

/** Public site header. Links and CTA come from the CMS (Admin → Site content). */
export async function SiteHeader() {
  const { site } = await publicContent();
  const { links, ctaLabel, ctaHref } = site.nav;

  return (
    <header className="nav">
      <Logo />
      <nav>
        {links.map((l) =>
          l.href.startsWith("/") && !l.href.includes("#") ? (
            <Link key={l.href + l.label} href={l.href}>
              {l.label}
            </Link>
          ) : (
            <a key={l.href + l.label} href={l.href}>
              {l.label}
            </a>
          ),
        )}
      </nav>
      <a className="pill" href={ctaHref}>
        {ctaLabel}
      </a>
    </header>
  );
}
