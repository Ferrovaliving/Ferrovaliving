"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Item = { id: string; image: string; name: string; model?: string; materials: string[] };

/**
 * Product grid for a collection page with a material filter at the top.
 * Only materials that at least one product in the collection uses get a tile,
 * ordered like `materialOrder`; with none tagged, no filter bar is shown.
 */
export function CollectionGrid({ items, materialOrder }: { items: Item[]; materialOrder: string[] }) {
  const [active, setActive] = useState<string>("all");

  const options = useMemo(() => {
    const count = new Map<string, number>();
    for (const it of items) for (const m of it.materials) count.set(m, (count.get(m) || 0) + 1);
    const ordered = [...materialOrder.filter((m) => count.has(m)), ...[...count.keys()].filter((m) => !materialOrder.includes(m))];
    return ordered.map((m) => ({ name: m, n: count.get(m) || 0 }));
  }, [items, materialOrder]);

  const visible = active === "all" ? items : items.filter((it) => it.materials.includes(active));

  return (
    <>
      {options.length > 0 && (
        <div className="matFilter" role="tablist" aria-label="Filter by material">
          <button type="button" role="tab" aria-selected={active === "all"} className={active === "all" ? "on" : ""} onClick={() => setActive("all")}>
            All <span>{items.length}</span>
          </button>
          {options.map((o) => (
            <button
              type="button"
              role="tab"
              aria-selected={active === o.name}
              key={o.name}
              className={active === o.name ? "on" : ""}
              onClick={() => setActive(o.name)}
            >
              {o.name} <span>{o.n}</span>
            </button>
          ))}
        </div>
      )}
      <div className="collectionGrid collectionGrid--named">
        {visible.map((p) => (
          <Link className="collectionItem" href={`/products/${p.id}`} key={p.id}>
            <span className="collectionItem__img">
              <img src={p.image} alt={p.name} loading="lazy" />
            </span>
            <span className="collectionItem__cap">
              <b>{p.name}</b>
              {p.model && <em>{p.model}</em>}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
