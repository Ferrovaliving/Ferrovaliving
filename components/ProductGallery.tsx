"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";

type Cat = { id: string; name: string };
type Item = { id: string; image: string; catId: string; name: string; model?: string };

export function ProductGallery({
  categories,
  items,
  intro,
}: {
  categories: Cat[];
  items: Item[];
  intro: string;
}) {
  const [active, setActive] = useState<string>("all");
  const visible = useMemo(
    () => (active === "all" ? items : items.filter((i) => i.catId === active)),
    [active, items],
  );

  return (
    <>
      <nav className="catBar">
        <button className={active === "all" ? "on" : ""} onClick={() => setActive("all")}>
          <Icon name="frame" />
          <span>All</span>
        </button>
        {categories.map((c) => (
          <button key={c.id} className={active === c.id ? "on" : ""} onClick={() => setActive(c.id)}>
            <Icon name={c.id} />
            <span>{c.name}</span>
          </button>
        ))}
      </nav>
      <section className="section productsSection">
        <p className="catalogIntro">{intro}</p>
        <div className="catalogGrid">
          {visible.map((p) => (
            <Link className="product" href={`/products/${p.id}`} key={p.id}>
              <div className="productImage">
                <img src={p.image} alt={p.name} loading="lazy" />
              </div>
              <div className="productCap">
                <b>{p.name}</b>
                {p.model && <em>{p.model}</em>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
