"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Content, SiteContent } from "../lib/site-content";
import { saveContent, uploadContentImage } from "../lib/content-actions";
import { CmsNav } from "./CmsNav";

const ICONS = [
  "frame", "fabric", "weave", "finish", "medal", "ruler", "truck", "people",
  "lounge", "daybeds", "sofas", "bar-stools", "balcony-sets", "dining", "bar",
  "loungers", "tables", "custom",
];

const move = <T,>(a: T[], i: number, d: number): T[] => {
  const j = i + d;
  if (j < 0 || j >= a.length) return a;
  const n = [...a];
  [n[i], n[j]] = [n[j], n[i]];
  return n;
};

export function SiteEditor({ initial }: { initial: Content }) {
  const router = useRouter();
  const [site, setSite] = useState<SiteContent>(() => JSON.parse(JSON.stringify(initial.site)));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const patch = (fn: (d: SiteContent) => void) => {
    setErr("");
    setSite((prev) => {
      const d = JSON.parse(JSON.stringify(prev)) as SiteContent;
      fn(d);
      return d;
    });
    setDirty(true);
  };
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2600);
  };

  async function onHeroImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { path } = await uploadContentImage(fd);
      patch((d) => {
        d.hero.image = path;
      });
      flash("Image uploaded — Save to publish");
    } catch (e2) {
      setErr(`Upload failed: ${e2 instanceof Error ? e2.message : "unknown error"}`);
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setErr("");
    try {
      await saveContent({ ...initial, site });
      setDirty(false);
      flash("Saved and published ✓");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const IconSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {ICONS.map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );

  return (
    <div className="catalogPage">
      <CmsNav current="/admin/site" />
      <header className="catalogTop">
        <div>
          <h1>Site content</h1>
          <p>
            Everything on the public pages — navigation, hero, section headings, FAQ, the enquiry
            form, footer, contact details and SEO. Changes go live when you press <b>Save changes</b>.
          </p>
        </div>
        <div className="catalogTopActions">
          <a href="/" target="_blank" rel="noreferrer">Preview site ↗</a>
          <button type="button" className="primary" onClick={save} disabled={saving || !dirty}>
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </header>

      {err && <div className="catalogError">{err}</div>}

      <div className="cmsForm">
        {/* NAVIGATION */}
        <h2>Header navigation</h2>
        {site.nav.links.map((l, i) => (
          <div className="cmsCard__inline" key={i}>
            <label>Label<input value={l.label} onChange={(e) => patch((d) => { d.nav.links[i].label = e.target.value; })} /></label>
            <label>Link<input value={l.href} onChange={(e) => patch((d) => { d.nav.links[i].href = e.target.value; })} /></label>
            <div className="reorder">
              <button type="button" onClick={() => patch((d) => { d.nav.links = move(d.nav.links, i, -1); })} disabled={i === 0}>↑</button>
              <button type="button" onClick={() => patch((d) => { d.nav.links = move(d.nav.links, i, 1); })} disabled={i === site.nav.links.length - 1}>↓</button>
              <button type="button" className="link danger" onClick={() => patch((d) => { d.nav.links.splice(i, 1); })}>×</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => patch((d) => { d.nav.links.push({ label: "New link", href: "/" }); })}>+ Add nav link</button>
        <div className="cmsCard__inline">
          <label>Button label<input value={site.nav.ctaLabel} onChange={(e) => patch((d) => { d.nav.ctaLabel = e.target.value; })} /></label>
          <label>Button link<input value={site.nav.ctaHref} onChange={(e) => patch((d) => { d.nav.ctaHref = e.target.value; })} /></label>
        </div>

        {/* HERO */}
        <h2>Hero section</h2>
        <label>Eyebrow<input value={site.hero.eyebrow} onChange={(e) => patch((d) => { d.hero.eyebrow = e.target.value; })} /></label>
        <label>Headline (use a new line for the line break)
          <textarea rows={2} value={site.hero.headline} onChange={(e) => patch((d) => { d.hero.headline = e.target.value; })} />
        </label>
        <label>Accent word (italic, after the headline)<input value={site.hero.accent} onChange={(e) => patch((d) => { d.hero.accent = e.target.value; })} /></label>
        <label>Intro line<textarea rows={2} value={site.hero.intro} onChange={(e) => patch((d) => { d.hero.intro = e.target.value; })} /></label>
        <div className="cmsCard__inline">
          <label>Button label<input value={site.hero.ctaLabel} onChange={(e) => patch((d) => { d.hero.ctaLabel = e.target.value; })} /></label>
          <label>Button link<input value={site.hero.ctaHref} onChange={(e) => patch((d) => { d.hero.ctaHref = e.target.value; })} /></label>
        </div>
        <label>Scroll hint text<input value={site.hero.scrollText} onChange={(e) => patch((d) => { d.hero.scrollText = e.target.value; })} /></label>
        <label>Background image
          <div className="projThumb" style={{ display: "block" }}>
            {site.hero.image ? <img src={site.hero.image} alt="" /> : <span>Using default (/hero.webp)</span>}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={onHeroImage} />
            <em>{uploading ? "Uploading…" : "Upload / replace"}</em>
          </div>
        </label>
        {site.hero.image && (
          <button type="button" className="link danger" onClick={() => patch((d) => { d.hero.image = ""; })}>
            Reset to default hero image
          </button>
        )}

        {/* FEATURE STRIP */}
        <h2>Material / feature strip</h2>
        {site.features.map((f, i) => (
          <div className="cmsCard__inline" key={i}>
            <label>Icon<IconSelect value={f.icon} onChange={(v) => patch((d) => { d.features[i].icon = v; })} /></label>
            <label>Label<input value={f.label} onChange={(e) => patch((d) => { d.features[i].label = e.target.value; })} /></label>
            <div className="reorder">
              <button type="button" onClick={() => patch((d) => { d.features = move(d.features, i, -1); })} disabled={i === 0}>↑</button>
              <button type="button" onClick={() => patch((d) => { d.features = move(d.features, i, 1); })} disabled={i === site.features.length - 1}>↓</button>
              <button type="button" className="link danger" onClick={() => patch((d) => { d.features.splice(i, 1); })}>×</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => patch((d) => { d.features.push({ icon: "frame", label: "New feature" }); })}>+ Add feature</button>

        {/* COLLECTION SECTION */}
        <h2>Home “Explore by Category” heading</h2>
        <div className="cmsCard__inline">
          <label>Eyebrow<input value={site.collectionSection.eyebrow} onChange={(e) => patch((d) => { d.collectionSection.eyebrow = e.target.value; })} /></label>
          <label>Heading<input value={site.collectionSection.heading} onChange={(e) => patch((d) => { d.collectionSection.heading = e.target.value; })} /></label>
        </div>
        <label>“View all” button label<input value={site.collectionSection.ctaLabel} onChange={(e) => patch((d) => { d.collectionSection.ctaLabel = e.target.value; })} /></label>

        {/* WHY CHOOSE US */}
        <h2>“Why Choose Us” section</h2>
        <div className="cmsCard__inline">
          <label>Eyebrow<input value={site.why.eyebrow} onChange={(e) => patch((d) => { d.why.eyebrow = e.target.value; })} /></label>
          <label>Heading<input value={site.why.heading} onChange={(e) => patch((d) => { d.why.heading = e.target.value; })} /></label>
        </div>
        <label>Intro paragraph<textarea rows={3} value={site.why.intro} onChange={(e) => patch((d) => { d.why.intro = e.target.value; })} /></label>
        {site.why.items.map((w, i) => (
          <div className="cmsCard__inline" key={i}>
            <label>Icon<IconSelect value={w.icon} onChange={(v) => patch((d) => { d.why.items[i].icon = v; })} /></label>
            <label>Label<input value={w.label} onChange={(e) => patch((d) => { d.why.items[i].label = e.target.value; })} /></label>
            <div className="reorder">
              <button type="button" onClick={() => patch((d) => { d.why.items = move(d.why.items, i, -1); })} disabled={i === 0}>↑</button>
              <button type="button" onClick={() => patch((d) => { d.why.items = move(d.why.items, i, 1); })} disabled={i === site.why.items.length - 1}>↓</button>
              <button type="button" className="link danger" onClick={() => patch((d) => { d.why.items.splice(i, 1); })}>×</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => patch((d) => { d.why.items.push({ icon: "medal", label: "New point" }); })}>+ Add point</button>

        {/* TESTIMONIALS + PROJECTS HEADINGS */}
        <h2>Testimonials heading</h2>
        <div className="cmsCard__inline">
          <label>Eyebrow<input value={site.testimonialSection.eyebrow} onChange={(e) => patch((d) => { d.testimonialSection.eyebrow = e.target.value; })} /></label>
          <label>Heading<input value={site.testimonialSection.heading} onChange={(e) => patch((d) => { d.testimonialSection.heading = e.target.value; })} /></label>
        </div>
        <p className="catalogIntro">Add or edit the reviews themselves in <a href="/admin/testimonials">Testimonials</a>.</p>

        <h2>Home projects teaser heading</h2>
        <div className="cmsCard__inline">
          <label>Eyebrow<input value={site.projectSection.eyebrow} onChange={(e) => patch((d) => { d.projectSection.eyebrow = e.target.value; })} /></label>
          <label>Heading<input value={site.projectSection.heading} onChange={(e) => patch((d) => { d.projectSection.heading = e.target.value; })} /></label>
        </div>
        <label>“View all” button label<input value={site.projectSection.ctaLabel} onChange={(e) => patch((d) => { d.projectSection.ctaLabel = e.target.value; })} /></label>

        {/* FAQ */}
        <h2>FAQ</h2>
        <div className="cmsCard__inline">
          <label>Eyebrow<input value={site.faq.eyebrow} onChange={(e) => patch((d) => { d.faq.eyebrow = e.target.value; })} /></label>
          <label>Heading<input value={site.faq.heading} onChange={(e) => patch((d) => { d.faq.heading = e.target.value; })} /></label>
        </div>
        {site.faq.items.map((f, i) => (
          <div className="cmsCard" key={i} style={{ padding: 12 }}>
            <label>Question<input value={f.q} onChange={(e) => patch((d) => { d.faq.items[i].q = e.target.value; })} /></label>
            <label>Answer<textarea rows={3} value={f.a} onChange={(e) => patch((d) => { d.faq.items[i].a = e.target.value; })} /></label>
            <div className="reorder">
              <button type="button" onClick={() => patch((d) => { d.faq.items = move(d.faq.items, i, -1); })} disabled={i === 0}>↑</button>
              <button type="button" onClick={() => patch((d) => { d.faq.items = move(d.faq.items, i, 1); })} disabled={i === site.faq.items.length - 1}>↓</button>
              <button type="button" className="link danger" onClick={() => patch((d) => { d.faq.items.splice(i, 1); })}>Delete question</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => patch((d) => { d.faq.items.push({ q: "New question?", a: "" }); })}>+ Add question</button>

        {/* ENQUIRY FORM */}
        <h2>Enquiry form (home page)</h2>
        <div className="cmsCard__inline">
          <label>Eyebrow<input value={site.enquiry.eyebrow} onChange={(e) => patch((d) => { d.enquiry.eyebrow = e.target.value; })} /></label>
          <label>Heading<input value={site.enquiry.heading} onChange={(e) => patch((d) => { d.enquiry.heading = e.target.value; })} /></label>
        </div>
        <label>Accent line (italic)<input value={site.enquiry.accent} onChange={(e) => patch((d) => { d.enquiry.accent = e.target.value; })} /></label>
        <label>Success message<input value={site.enquiry.success} onChange={(e) => patch((d) => { d.enquiry.success = e.target.value; })} /></label>
        <label>Budget options (one per line)
          <textarea
            rows={4}
            value={site.enquiry.budgets.join("\n")}
            onChange={(e) => patch((d) => { d.enquiry.budgets = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean); })}
          />
        </label>

        {/* FOOTER */}
        <h2>Footer</h2>
        {site.footer.links.map((l, i) => (
          <div className="cmsCard__inline" key={i}>
            <label>Label<input value={l.label} onChange={(e) => patch((d) => { d.footer.links[i].label = e.target.value; })} /></label>
            <label>Link<input value={l.href} onChange={(e) => patch((d) => { d.footer.links[i].href = e.target.value; })} /></label>
            <div className="reorder">
              <button type="button" onClick={() => patch((d) => { d.footer.links = move(d.footer.links, i, -1); })} disabled={i === 0}>↑</button>
              <button type="button" onClick={() => patch((d) => { d.footer.links = move(d.footer.links, i, 1); })} disabled={i === site.footer.links.length - 1}>↓</button>
              <button type="button" className="link danger" onClick={() => patch((d) => { d.footer.links.splice(i, 1); })}>×</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => patch((d) => { d.footer.links.push({ label: "New link", href: "/" }); })}>+ Add footer link</button>
        <label>Copyright line<input value={site.footer.copyright} onChange={(e) => patch((d) => { d.footer.copyright = e.target.value; })} /></label>

        {/* INNER PAGES */}
        <h2>Collections page</h2>
        <label>Banner heading<input value={site.collectionsPage.heading} onChange={(e) => patch((d) => { d.collectionsPage.heading = e.target.value; })} /></label>
        <label>Intro paragraph<textarea rows={2} value={site.collectionsPage.intro} onChange={(e) => patch((d) => { d.collectionsPage.intro = e.target.value; })} /></label>
        <label>Collection detail intro paragraph<textarea rows={2} value={site.collectionDetail.intro} onChange={(e) => patch((d) => { d.collectionDetail.intro = e.target.value; })} /></label>

        <h2>Projects page</h2>
        <label>Banner heading<input value={site.projectsPage.heading} onChange={(e) => patch((d) => { d.projectsPage.heading = e.target.value; })} /></label>
        <label>Intro paragraph<textarea rows={2} value={site.projectsPage.intro} onChange={(e) => patch((d) => { d.projectsPage.intro = e.target.value; })} /></label>
        <label>Text shown when there are no projects<input value={site.projectsPage.empty} onChange={(e) => patch((d) => { d.projectsPage.empty = e.target.value; })} /></label>

        <h2>All Products page</h2>
        <label>Intro paragraph<textarea rows={2} value={site.productsPage.intro} onChange={(e) => patch((d) => { d.productsPage.intro = e.target.value; })} /></label>

        {/* CONTACT */}
        <h2>Contact details</h2>
        <p className="catalogIntro">Used in the footer, floating buttons, contact page and enquiry form.</p>
        <div className="cmsCard__inline">
          <label>Company name<input value={site.contact.company} onChange={(e) => patch((d) => { d.contact.company = e.target.value; })} /></label>
          <label>Tagline<input value={site.contact.tagline} onChange={(e) => patch((d) => { d.contact.tagline = e.target.value; })} /></label>
        </div>
        <div className="cmsCard__inline">
          <label>Phone (display)<input value={site.contact.phoneDisplay} onChange={(e) => patch((d) => { d.contact.phoneDisplay = e.target.value; })} /></label>
          <label>Phone (digits only, for call link)<input value={site.contact.phoneDigits} onChange={(e) => patch((d) => { d.contact.phoneDigits = e.target.value; })} /></label>
        </div>
        <div className="cmsCard__inline">
          <label>WhatsApp number (digits, country code first)<input value={site.contact.whatsappDigits} onChange={(e) => patch((d) => { d.contact.whatsappDigits = e.target.value; })} /></label>
          <label>Email<input value={site.contact.email} onChange={(e) => patch((d) => { d.contact.email = e.target.value; })} /></label>
        </div>
        <label>Default WhatsApp message<textarea rows={2} value={site.contact.whatsappMessage} onChange={(e) => patch((d) => { d.contact.whatsappMessage = e.target.value; })} /></label>
        <div className="cmsCard__inline">
          <label>Instagram handle<input value={site.contact.instagramHandle} onChange={(e) => patch((d) => { d.contact.instagramHandle = e.target.value; })} /></label>
          <label>Instagram URL<input value={site.contact.instagramUrl} onChange={(e) => patch((d) => { d.contact.instagramUrl = e.target.value; })} /></label>
        </div>
        <label>Opening hours<input value={site.contact.hours} onChange={(e) => patch((d) => { d.contact.hours = e.target.value; })} /></label>
        <div className="cmsCard__inline">
          <label>Address line 1<input value={site.contact.addressLine1} onChange={(e) => patch((d) => { d.contact.addressLine1 = e.target.value; })} /></label>
          <label>Address line 2<input value={site.contact.addressLine2} onChange={(e) => patch((d) => { d.contact.addressLine2 = e.target.value; })} /></label>
        </div>

        {/* SEO */}
        <h2>SEO &amp; social</h2>
        <div className="cmsCard__inline">
          <label>Site name<input value={site.seo.siteName} onChange={(e) => patch((d) => { d.seo.siteName = e.target.value; })} /></label>
          <label>Tagline<input value={site.seo.tagline} onChange={(e) => patch((d) => { d.seo.tagline = e.target.value; })} /></label>
        </div>
        <label>Meta description<textarea rows={3} value={site.seo.description} onChange={(e) => patch((d) => { d.seo.description = e.target.value; })} /></label>
        <label>Keywords (one per line)
          <textarea
            rows={5}
            value={site.seo.keywords.join("\n")}
            onChange={(e) => patch((d) => { d.seo.keywords = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean); })}
          />
        </label>

        <div className="catalogTopActions" style={{ marginTop: 24 }}>
          <button type="button" className="primary" onClick={save} disabled={saving || !dirty}>
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>

      {msg && <div className="toast">{msg}</div>}
    </div>
  );
}
