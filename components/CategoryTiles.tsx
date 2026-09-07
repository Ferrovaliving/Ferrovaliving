import Link from "next/link";
import type { CatalogCategory } from "../lib/catalog";

export function CategoryTiles({ categories }: { categories: CatalogCategory[] }) {
  if (!categories.length) {
    return <p className="catalogIntro">No collections published yet. Add them in Admin → Catalog.</p>;
  }
  return (
    <div className="catTiles">
      {categories.map((c) => (
        <Link key={c.id} href={`/collections/${c.id}`} className="catTile">
          <div className="catTileImg">
            <img src={c.hero || c.products[0]?.image} alt={c.name} />
          </div>
          <div className="catTileShade" />
          <span className="catTileCount">
            {c.products.length} {c.products.length === 1 ? "design" : "designs"}
          </span>
          <span className="catTileLabel">
            {c.name}
            <i>↗</i>
          </span>
        </Link>
      ))}
    </div>
  );
}
