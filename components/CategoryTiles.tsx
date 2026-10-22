import Link from "next/link";
import type { CatalogCategory } from "../lib/catalog";
import { Icon, iconForCategory } from "./Icon";

export function CategoryTiles({
  categories,
  compact = false,
}: {
  categories: CatalogCategory[];
  compact?: boolean;
}) {
  if (!categories.length) {
    return <p className="catalogIntro">No collections published yet. Add them in Admin → Catalog.</p>;
  }
  return (
    <div className={`catTiles${compact ? " catTiles--compact" : ""}`}>
      {categories.map((c) => {
        const img = c.hero || c.products[0]?.image;
        const n = c.products.length;
        return (
          <Link key={c.id} href={`/collections/${c.id}`} className={`catTile${img ? "" : " catTile--empty"}`}>
            {img ? (
              <>
                <div className="catTileImg">
                  <img src={img} alt={c.name} loading="lazy" />
                </div>
                <div className="catTileShade" />
              </>
            ) : (
              <div className="catTilePlaceholder" aria-hidden="true">
                <Icon name={iconForCategory(c.id, c.name)} />
              </div>
            )}
            <span className="catTileCount">
              {n === 0 ? "Coming soon" : `${n} ${n === 1 ? "design" : "designs"}`}
            </span>
            <span className="catTileLabel">
              {c.name}
              <i>↗</i>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

/** Categories split into "by furniture type" and "by material" sub-sections. */
export function CategoryGroups({
  type,
  material,
  typeHeading,
  materialHeading,
}: {
  type: CatalogCategory[];
  material: CatalogCategory[];
  typeHeading: string;
  materialHeading: string;
}) {
  // With no material categories, render a single plain grid (no sub-headings).
  if (!material.length) return <CategoryTiles categories={type} compact={type.length > 4} />;
  return (
    <div className="catGroups">
      {type.length > 0 && (
        <div className="catGroup">
          <h3 className="catGroup__title">{typeHeading}</h3>
          <CategoryTiles categories={type} compact />
        </div>
      )}
      <div className="catGroup">
        <h3 className="catGroup__title">{materialHeading}</h3>
        <CategoryTiles categories={material} compact />
      </div>
    </div>
  );
}
