import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { publicContent } from "../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projects" };

export default async function Page() {
  const { projects, site } = await publicContent();
  const { heading, intro, empty } = site.projectsPage;

  return (
    <main>
      <SiteHeader />

      <section className="productsBanner">
        <div className="productsBannerImg" />
        <div className="productsBannerShade" />
        <div>
          <h1>{heading}</h1>
          <p>Home · {heading}</p>
        </div>
      </section>

      <section className="section productsSection">
        <p className="catalogIntro">{intro}</p>

        {projects.length === 0 ? (
          <p className="catalogIntro">{empty}</p>
        ) : (
          <div className="projList">
            {projects.map((p, i) => (
              <article className={`projRow${i % 2 ? " projRow--flip" : ""}`} key={p.id}>
                {p.image && (
                  <div className="projRow__img">
                    <img src={p.image} alt={p.title} loading="lazy" />
                  </div>
                )}
                <div className="projRow__body">
                  <p className="eyebrow gold">{[p.kind, p.location].filter(Boolean).join(" · ")}</p>
                  <h2>{p.title}</h2>
                  <p>{p.summary}</p>
                  <Link className="darkButton" href="/#contact">
                    Enquire about a project like this <b>↗</b>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
