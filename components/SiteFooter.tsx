import Link from "next/link";
import { publicContent, whatsappUrl } from "../lib/content";

export async function SiteFooter() {
  const { site } = await publicContent();
  const c = site.contact;
  const wordmark = c.company.split(/\s+/);

  return (
    <footer>
      <Link href="/" className="footWordmark" aria-label={`${c.company} home`}>
        <b>{(wordmark[0] || "FERROVA").toUpperCase()}</b>
        <span>{wordmark.slice(1).join(" ") || "Living"}</span>
      </Link>
      <div>
        <b>QUICK LINKS</b>
        {site.footer.links.map((l) => (
          <Link key={l.href + l.label} href={l.href}>
            {l.label}
          </Link>
        ))}
      </div>
      <div>
        <b>ADDRESS</b>
        <p>
          {c.addressLine1}
          <br />
          {c.addressLine2}
        </p>
        <p>{c.hours}</p>
      </div>
      <div>
        <b>CONTACT US</b>
        <p>
          <a href={`tel:+${c.phoneDigits}`}>{c.phoneDisplay}</a>
          <br />
          <a href={`mailto:${c.email}`}>{c.email}</a>
        </p>
        <div className="social">
          <a href={whatsappUrl(c)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            WhatsApp
          </a>
          <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            Instagram
          </a>
        </div>
      </div>
      <p className="copyright">{site.footer.copyright}</p>
    </footer>
  );
}
