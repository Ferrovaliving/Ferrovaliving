import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "../../components/ContactForm";
import { publicContent, whatsappUrl } from "../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact" };

export default async function Page() {
  const { site } = await publicContent();
  const c = site.contact;

  return (
    <main className="simple">
      <nav>
        <Link href="/">← {c.company}</Link>
      </nav>
      <section>
        <p>START A CONVERSATION</p>
        <h1>Tell us about your space.</h1>

        <ul className="contactList">
          <li>
            <span>WhatsApp</span>
            <a href={whatsappUrl(c)} target="_blank" rel="noopener noreferrer">
              {c.phoneDisplay}
            </a>
          </li>
          <li>
            <span>Call</span>
            <a href={`tel:+${c.phoneDigits}`}>{c.phoneDisplay}</a>
          </li>
          <li>
            <span>Instagram</span>
            <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer">
              {c.instagramHandle}
            </a>
          </li>
          <li>
            <span>Email</span>
            <a href={`mailto:${c.email}`}>{c.email}</a>
          </li>
          <li>
            <span>Hours</span>
            <span>{c.hours}</span>
          </li>
        </ul>

        <ContactForm />
      </section>
    </main>
  );
}
