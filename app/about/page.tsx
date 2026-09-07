import Link from "next/link";
import type { Metadata } from "next";
import { publicContent } from "../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "About" };

export default async function Page() {
  const { about, site } = await publicContent();
  return (
    <main className="simple">
      <nav>
        <Link href="/">← {site.contact.company}</Link>
        <Link href="/contact">Start a project ↗</Link>
      </nav>
      <section>
        <p>{about.pageEyebrow.toUpperCase()}</p>
        <h1>{about.pageTitle}</h1>
        {about.pageBody.map((para, i) => (
          <article key={i}>{para}</article>
        ))}
      </section>
    </main>
  );
}
