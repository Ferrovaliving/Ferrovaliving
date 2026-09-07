import Link from "next/link";
import { Icon } from "../components/Icon";
import { CategoryTiles } from "../components/CategoryTiles";
import { EnquiryForm } from "../components/EnquiryForm";
import { Faq } from "../components/Faq";
import { InviteRedirect } from "../components/InviteRedirect";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { publicCatalog } from "../lib/catalog";
import { publicContent } from "../lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { categories } = await publicCatalog();
  const { about, testimonials, projects, site } = await publicContent();
  const { hero, features, collectionSection, why, testimonialSection, projectSection } = site;

  return (
    <main>
      <InviteRedirect />
      <SiteHeader />

      <section className="hero">
        <div
          className="heroImage"
          style={hero.image ? { backgroundImage: `url(${JSON.stringify(hero.image)})` } : undefined}
        />
        <div className="heroShade" />
        <div className="heroCopy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>
            {hero.headline.split("\n").map((line, i, all) => (
              <span key={i}>
                {line}
                {i < all.length - 1 && <br />}
              </span>
            ))}
            {hero.accent && (
              <>
                {" "}
                <i>{hero.accent}</i>
              </>
            )}
          </h1>
          <p>{hero.intro}</p>
          <a className="lightButton" href={hero.ctaHref}>
            {hero.ctaLabel} <b>↗</b>
          </a>
        </div>
        {hero.scrollText && (
          <div className="scroll">
            {hero.scrollText} <i>↓</i>
          </div>
        )}
      </section>

      {features.length > 0 && (
        <section className="features">
          {features.map((f, i) => (
            <div key={f.label + i}>
              <Icon name={f.icon} />
              <span>{f.label}</span>
            </div>
          ))}
        </section>
      )}

      <section className="aboutSplit">
        <div>
          <p className="eyebrow">{about.eyebrow.toUpperCase()}</p>
          <h2>
            {about.headingLine1}
            <br />
            <i>{about.headingLine2}</i>
          </h2>
          <p>{about.intro}</p>
        </div>
        <div>
          {about.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <section id="products" className="section productsSection">
        <p className="eyebrow gold tc">{collectionSection.eyebrow}</p>
        <h2 className="tc">{collectionSection.heading}</h2>
        <CategoryTiles categories={categories} />
        <div className="center">
          <Link className="darkButton" href="/collections">
            {collectionSection.ctaLabel} <b>↗</b>
          </Link>
        </div>
      </section>

      <section id="why" className="whyChoose">
        <p className="eyebrow gold">{why.eyebrow}</p>
        <h2>{why.heading}</h2>
        <p>{why.intro}</p>
        <div className="whyGrid">
          {why.items.map((w, i) => (
            <div key={w.label + i}>
              <Icon name={w.icon} />
              <b>{w.label}</b>
            </div>
          ))}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="reviews">
          <p className="eyebrow gold">{testimonialSection.eyebrow}</p>
          <h2>{testimonialSection.heading}</h2>
          <div className="reviewGrid">
            {testimonials.map((t) => (
              <div className="reviewCard" key={t.id}>
                <p>“{t.quote}”</p>
                <b>{t.name}</b>
                <span>{t.role}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="reviews projectsTeaser">
          <p className="eyebrow gold">{projectSection.eyebrow}</p>
          <h2>{projectSection.heading}</h2>
          <div className="projGrid">
            {projects.slice(0, 3).map((p) => (
              <Link href="/projects" className="projCard" key={p.id}>
                {p.image && (
                  <div className="projCard__img">
                    <img src={p.image} alt={p.title} />
                  </div>
                )}
                <b>{p.title}</b>
                <span>{[p.kind, p.location].filter(Boolean).join(" · ")}</span>
              </Link>
            ))}
          </div>
          <div className="center">
            <Link className="darkButton" href="/projects">
              {projectSection.ctaLabel} <b>↗</b>
            </Link>
          </div>
        </section>
      )}

      <Faq eyebrow={site.faq.eyebrow} heading={site.faq.heading} items={site.faq.items} />
      <EnquiryForm enquiry={site.enquiry} contact={site.contact} />
      <SiteFooter />
    </main>
  );
}
