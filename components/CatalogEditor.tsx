"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Catalog, CatalogCategory, CatalogProduct } from "../lib/catalog";
import { saveCatalog, uploadCatalogImage } from "../lib/catalog-actions";
import { CmsNav } from "./CmsNav";

const clone = (c: Catalog): CatalogCategory[] =>
  JSON.parse(JSON.stringify(c.categories)) as CatalogCategory[];

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

export function CatalogEditor({ initial }: { initial: Catalog }) {
  const router = useRouter();
  const [cats, setCats] = useState<CatalogCategory[]>(() => clone(initial));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2800);
  };

  const mutate = (fn: (draft: CatalogCategory[]) => CatalogCategory[]) => {
    setError("");
    setCats((prev) => fn(prev.map((c) => ({ ...c, products: [...c.products] }))));
    setDirty(true);
  };

  // ---- category ops ----
  const addCategory = () => {
    mutate((d) => [
      ...d,
      { id: `category-${d.length + 1}`, name: "New category", hero: "", visible: true, products: [] },
    ]);
    flash("Category added — scroll down, rename it and add images");
  };
  const moveCat = (i: number, dir: number) => mutate((d) => moveItem(d, i, i + dir));
  const renameCat = (i: number, name: string) =>
    mutate((d) => d.map((c, ci) => (ci === i ? { ...c, name } : c)));
  const toggleCat = (i: number) =>
    mutate((d) => d.map((c, ci) => (ci === i ? { ...c, visible: !c.visible } : c)));
  const deleteCat = (i: number) => {
    setConfirmDelete(null);
    mutate((d) => d.filter((_, ci) => ci !== i));
    flash("Category removed — Save to publish");
  };

  // ---- product ops ----
  const setHero = (ci: number, image: string) =>
    mutate((d) => d.map((c, i) => (i === ci ? { ...c, hero: image } : c)));
  const moveProduct = (ci: number, pi: number, dir: number) =>
    mutate((d) => d.map((c, i) => (i === ci ? { ...c, products: moveItem(c.products, pi, pi + dir) } : c)));
  const toggleProduct = (ci: number, pi: number) =>
    mutate((d) =>
      d.map((c, i) =>
        i === ci
          ? { ...c, products: c.products.map((p, j) => (j === pi ? { ...p, visible: !p.visible } : p)) }
          : c,
      ),
    );
  const deleteProduct = (ci: number, pi: number) =>
    mutate((d) =>
      d.map((c, i) => (i === ci ? { ...c, products: c.products.filter((_, j) => j !== pi) } : c)),
    );

  async function onUpload(ci: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(ci);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { path } = await uploadCatalogImage(fd);
      const id = (path.split("/").pop() || path).replace(/\.[^.]+$/, "");
      const product: CatalogProduct = { id, image: path, visible: true };
      mutate((d) =>
        d.map((c, i) =>
          i === ci ? { ...c, products: [...c.products, product], hero: c.hero || path } : c,
        ),
      );
      flash("Image added — Save to publish");
    } catch (err) {
      setError(`Upload failed: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      await saveCatalog({ categories: cats });
      setDirty(false);
      flash("Saved and published ✓");
      router.refresh();
    } catch (err) {
      setError(`Save failed: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  const discard = () => {
    setCats(clone(initial));
    setDirty(false);
    setError("");
    setConfirmDelete(null);
  };

  return (
    <div className="catalogPage">
      <CmsNav current="/admin/catalog" />
      <header className="catalogTop">
        <div>
          <h1>Catalog &amp; Categories</h1>
          <p>
            Reorder with the arrows, hide items with the eye, pick each category’s tile image with the star. Changes are
            not live until you press <b>Save changes</b>.
          </p>
        </div>
        <div className="catalogTopActions">
          <a href="/" target="_blank" rel="noreferrer">Preview site ↗</a>
          <button type="button" onClick={addCategory}>+ Add category</button>
          {dirty && (
            <button type="button" onClick={discard}>Discard</button>
          )}
          <button type="button" className="primary" onClick={save} disabled={saving || !dirty}>
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </header>

      {error && <div className="catalogError">{error}</div>}

      <div className="catList">
        {cats.map((cat, ci) => (
          <section className={`catCard${cat.visible ? "" : " isHidden"}`} key={ci}>
            <div className="catCardHead">
              <div className="reorder">
                <button type="button" onClick={() => moveCat(ci, -1)} disabled={ci === 0} aria-label="Move category up">↑</button>
                <button type="button" onClick={() => moveCat(ci, 1)} disabled={ci === cats.length - 1} aria-label="Move category down">↓</button>
              </div>
              <input
                className="catName"
                value={cat.name}
                maxLength={80}
                onChange={(e) => renameCat(ci, e.target.value)}
              />
              <label className="catVis">
                <input type="checkbox" checked={cat.visible} onChange={() => toggleCat(ci)} /> Show on site
              </label>
              <span className="catMeta">
                {cat.products.filter((p) => p.visible).length}/{cat.products.length} shown
              </span>
              {confirmDelete === ci ? (
                <span className="confirmRow">
                  <button type="button" className="link danger" onClick={() => deleteCat(ci)}>Confirm delete</button>
                  <button type="button" className="link" onClick={() => setConfirmDelete(null)}>Cancel</button>
                </span>
              ) : (
                <button type="button" className="link danger" onClick={() => setConfirmDelete(ci)}>Delete</button>
              )}
            </div>

            <div className="prodGridEdit">
              {cat.products.map((p, pi) => (
                <figure
                  className={`prodCell${p.visible ? "" : " isOff"}${cat.hero === p.image ? " isTile" : ""}`}
                  key={p.id + pi}
                >
                  <img src={p.image} alt="" />
                  {cat.hero === p.image && <span className="heroBadge">Tile image</span>}
                  {!p.visible && <span className="offBadge">Hidden</span>}
                  <figcaption>
                    <button type="button" title="Move earlier" onClick={() => moveProduct(ci, pi, -1)} disabled={pi === 0}>←</button>
                    <button type="button" title="Move later" onClick={() => moveProduct(ci, pi, 1)} disabled={pi === cat.products.length - 1}>→</button>
                    <button type="button" title="Use as category tile image" onClick={() => setHero(ci, p.image)}>
                      {cat.hero === p.image ? "★" : "☆"}
                    </button>
                    <button type="button" title={p.visible ? "Hide from site" : "Show on site"} onClick={() => toggleProduct(ci, pi)}>
                      {p.visible ? "Hide" : "Show"}
                    </button>
                    <button type="button" title="Remove from category" className="danger" onClick={() => deleteProduct(ci, pi)}>×</button>
                  </figcaption>
                </figure>
              ))}
              <label className="prodAdd">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => onUpload(ci, e)}
                />
                <span>{uploading === ci ? "Uploading…" : "+ Upload image"}</span>
              </label>
            </div>
          </section>
        ))}
        {!cats.length && <p className="catalogEmpty">No categories yet. Click “+ Add category”.</p>}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
