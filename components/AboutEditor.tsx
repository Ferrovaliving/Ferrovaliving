"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { About, Content } from "../lib/content";
import { saveContent } from "../lib/content-actions";
import { CmsNav } from "./CmsNav";

export function AboutEditor({ initial }: { initial: Content }) {
  const router = useRouter();
  const [about, setAbout] = useState<About>(() => JSON.parse(JSON.stringify(initial.about)));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const set = (k: keyof About, v: string | string[]) => {
    setErr("");
    setAbout((a) => ({ ...a, [k]: v }));
    setDirty(true);
  };
  const setPara = (key: "body" | "pageBody", text: string) =>
    set(key, text.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean));

  async function save() {
    setSaving(true);
    setErr("");
    try {
      await saveContent({ ...initial, about });
      setDirty(false);
      setMsg("Saved and published ✓");
      setTimeout(() => setMsg(""), 2600);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="catalogPage">
      <CmsNav current="/admin/about" />
      <header className="catalogTop">
        <div>
          <h1>About content</h1>
          <p>The “About” block on the home page and the full text on the About page. Separate paragraphs with a blank line.</p>
        </div>
        <div className="catalogTopActions">
          <button type="button" className="primary" onClick={save} disabled={saving || !dirty}>
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </header>

      {err && <div className="catalogError">{err}</div>}

      <div className="cmsForm">
        <h2>Home page — About block</h2>
        <label>Eyebrow<input value={about.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} /></label>
        <div className="cmsCard__inline">
          <label>Heading line 1<input value={about.headingLine1} onChange={(e) => set("headingLine1", e.target.value)} /></label>
          <label>Heading line 2 (italic)<input value={about.headingLine2} onChange={(e) => set("headingLine2", e.target.value)} /></label>
        </div>
        <label>Intro line<textarea rows={2} value={about.intro} onChange={(e) => set("intro", e.target.value)} /></label>
        <label>
          Body paragraphs
          <textarea rows={7} value={about.body.join("\n\n")} onChange={(e) => setPara("body", e.target.value)} />
        </label>

        <h2>About page</h2>
        <label>Page eyebrow<input value={about.pageEyebrow} onChange={(e) => set("pageEyebrow", e.target.value)} /></label>
        <label>Page heading<input value={about.pageTitle} onChange={(e) => set("pageTitle", e.target.value)} /></label>
        <label>
          Page body paragraphs
          <textarea rows={8} value={about.pageBody.join("\n\n")} onChange={(e) => setPara("pageBody", e.target.value)} />
        </label>
      </div>

      {msg && <div className="toast">{msg}</div>}
    </div>
  );
}
