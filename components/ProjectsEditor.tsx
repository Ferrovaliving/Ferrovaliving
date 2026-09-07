"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Content, Project } from "../lib/content";
import { saveContent, uploadContentImage } from "../lib/content-actions";
import { CmsNav } from "./CmsNav";

const move = <T,>(a: T[], i: number, d: number): T[] => {
  const j = i + d;
  if (j < 0 || j >= a.length) return a;
  const n = [...a];
  [n[i], n[j]] = [n[j], n[i]];
  return n;
};

export function ProjectsEditor({ initial }: { initial: Content }) {
  const router = useRouter();
  const [items, setItems] = useState<Project[]>(() => JSON.parse(JSON.stringify(initial.projects || [])));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const mutate = (fn: (d: Project[]) => Project[]) => {
    setErr("");
    setItems((prev) => fn(prev.map((p) => ({ ...p }))));
    setDirty(true);
  };
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2600);
  };

  const add = () =>
    mutate((d) => [
      ...d,
      { id: `p-${Date.now().toString(36)}`, title: "New project", location: "", kind: "", summary: "", image: "", visible: true },
    ]);
  const upd = (i: number, k: keyof Project, v: string | boolean) =>
    mutate((d) => d.map((p, x) => (x === i ? { ...p, [k]: v } : p)));
  const del = (i: number) => mutate((d) => d.filter((_, x) => x !== i));

  async function onUpload(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(i);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { path } = await uploadContentImage(fd);
      upd(i, "image", path);
      flash("Image added — Save to publish");
    } catch (e2) {
      setErr(`Upload failed: ${e2 instanceof Error ? e2.message : "unknown error"}`);
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setSaving(true);
    setErr("");
    try {
      await saveContent({ ...initial, projects: items }, ["projects"]);
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
      <CmsNav current="/admin/projects" />
      <header className="catalogTop">
        <div>
          <h1>Projects</h1>
          <p>Real installations shown on the Projects page and home page. Add a photo, a short summary, and the location.</p>
        </div>
        <div className="catalogTopActions">
          <button type="button" onClick={add}>+ Add project</button>
          <button type="button" className="primary" onClick={save} disabled={saving || !dirty}>
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </header>

      {err && <div className="catalogError">{err}</div>}

      <div className="cmsList">
        {items.map((p, i) => (
          <section className={`cmsCard${p.visible ? "" : " isHidden"}`} key={p.id}>
            <div className="cmsCard__row">
              <div className="reorder">
                <button type="button" onClick={() => mutate((d) => move(d, i, -1))} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" onClick={() => mutate((d) => move(d, i, 1))} disabled={i === items.length - 1} aria-label="Move down">↓</button>
              </div>

              <label className="projThumb">
                {p.image ? <img src={p.image} alt="" /> : <span>No image</span>}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => onUpload(i, e)} />
                <em>{uploading === i ? "Uploading…" : "Upload / replace"}</em>
              </label>

              <div className="cmsCard__fields">
                <input value={p.title} placeholder="Project title" onChange={(e) => upd(i, "title", e.target.value)} />
                <div className="cmsCard__inline">
                  <input value={p.location} placeholder="Location (e.g. Udaipur)" onChange={(e) => upd(i, "location", e.target.value)} />
                  <input value={p.kind} placeholder="Type (e.g. Boutique Hotel)" onChange={(e) => upd(i, "kind", e.target.value)} />
                </div>
                <textarea value={p.summary} placeholder="One or two lines about the project…" rows={3} onChange={(e) => upd(i, "summary", e.target.value)} />
              </div>

              <div className="cmsCard__side">
                <label className="catVis">
                  <input type="checkbox" checked={p.visible} onChange={() => upd(i, "visible", !p.visible)} /> Show
                </label>
                <button type="button" className="link danger" onClick={() => del(i)}>Delete</button>
              </div>
            </div>
          </section>
        ))}
        {!items.length && <p className="catalogEmpty">No projects yet. Click “+ Add project”.</p>}
      </div>

      {msg && <div className="toast">{msg}</div>}
    </div>
  );
}
