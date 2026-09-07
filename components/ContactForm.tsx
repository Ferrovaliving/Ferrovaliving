"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || ""),
          kind: String(fd.get("kind") || "general"),
          message: String(fd.get("message") || ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setMsg(
          data.stored
            ? "Thank you. Our team will be in touch shortly."
            : "Thanks — we’ve received your message.",
        );
        form.reset();
      } else {
        setMsg(data.error || "Unable to send enquiry. Please try WhatsApp or email.");
      }
    } catch {
      setMsg("Network error — please try WhatsApp or email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <input name="name" placeholder="Your name" required minLength={2} />
      <input name="email" placeholder="Email address" type="email" />
      <input name="phone" placeholder="Phone or WhatsApp" />
      <select name="kind">
        <option value="general">General enquiry</option>
        <option value="product">Product enquiry</option>
        <option value="custom">Custom order</option>
        <option value="bulk">Bulk order</option>
        <option value="project">Project enquiry</option>
      </select>
      <textarea name="message" placeholder="Project details" rows={5} maxLength={5000} />
      <button className="darkButton" disabled={busy}>
        {busy ? "Sending…" : "Send enquiry ↗"}
      </button>
      {msg && <output>{msg}</output>}
    </form>
  );
}
