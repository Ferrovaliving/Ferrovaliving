"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Content, Testimonial } from "../lib/content";
import { saveContent } from "../lib/content-actions";
import { CmsNav } from "./CmsNav";

const move = <T,>(a: T[], i: number, d: number): T[] => {
  const j = i + d;
  if (j < 0 || j >= a.length) return a;
  const n = [...a];
  [n[i], n[j]] = [n[j], n[i]];
  return n;
};

export function TestimonialsEditor({ initial }: { initial: Content }) {
  const router = useRouter();
  const [items, setItems] = useState<Testimonial[]>(() =>
    JSON.parse(JSON.stringify(initial.testimonials || [])),
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const mutate = (fn: (d: Testimonial[]) => Testimonial[]) => {
    setErr("");
    setItems((prev) => fn(prev.map((t) => ({ ...t }))));
    setDirty(true);
  };
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2600);
  };

  const add = () =>
    mutate((d) => [...d, { id: `t-${Date.now().toString(36)}`, quote: "", name: "", role: "", visible: true }]);
  const upd = (i: number, k: keyof Testimonial, v: string | boolean) =>
    mutate((d) => d.map((t, x) => (x === i ? { ...t, [k]: v } : t)));
  const del = (i: number) => mutate((d) => d.filter((_, x) => x !== i));

  async function save() {
    setSaving(true);
    setErr("");
    try {
      await saveContent({ ...initial, testimonials: items });
      setDirty(false);
      flash("Saved and published ✓");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="catalogPage">
      <CmsNav current="/admin/testimonials" />
      <header className="catalogTop">
        <div>
          <h1>Testimonials</h1>
          <p>Add customer reviews shown on the home page. Hide any with the checkbox instead of deleting.</p>
        </div>
        <div className="catalogTopActions">
          <button type="button" onClick={add}>+ Add testimonial</button>
          <button type="button" className="primary" onClick={save} disabled={saving || !dirty}>
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </header>

      {err && <div className="catalogError">{err}</div>}

      <div className="cmsList">
        {items.map((t, i) => (
          <section className={`cmsCard${t.visible ? "" : " isHidden"}`} key={t.id}>
            <div className="cmsCard__row">
              <div className="reorder">
                <button type="button" onClick={() => mutate((d) => move(d, i, -1))} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" onClick={() => mutate((d) => move(d, i, 1))} disabled={i === items.length - 1} aria-label="Move down">↓</button>
              </div>
              <div className="cmsCard__fields">
                <textarea
                  value={t.quote}
                  placeholder="What the customer said…"
                  rows={3}
                  onChange={(e) => upd(i, "quote", e.target.value)}
                />
                <div className="cmsCard__inline">
                  <input value={t.name} placeholder="Name" onChange={(e) => upd(i, "name", e.target.value)} />
                  <input value={t.role} placeholder="Role / source (e.g. Architect, Google review)" onChange={(e) => upd(i, "role", e.target.value)} />
                </div>
              </div>
              <div className="cmsCard__side">
                <label className="catVis">
                  <input type="checkbox" checked={t.visible} onChange={() => upd(i, "visible", !t.visible)} /> Show
                </label>
                <button type="button" className="link danger" onClick={() => del(i)}>Delete</button>
              </div>
            </div>
          </section>
        ))}
        {!items.length && <p className="catalogEmpty">No testimonials yet. Click “+ Add testimonial”.</p>}
      </div>

      {msg && <div className="toast">{msg}</div>}
    </div>
  );
}
