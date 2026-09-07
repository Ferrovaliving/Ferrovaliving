"use client";

import { FormEvent, useState } from "react";
import { configured, insert } from "../lib/supabase";

export function ContactForm() {
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone")),
      kind: String(fd.get("kind")),
      message: String(fd.get("message")),
      status: "new",
    };
    try {
      if (configured) await insert("enquiries", data);
      setMsg(
        configured
          ? "Thank you. Our team will be in touch shortly."
          : "Demo submitted. Connect Supabase to store enquiries.",
      );
      form.reset();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Unable to send enquiry");
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
      <button className="darkButton">Send enquiry ↗</button>
      {msg && <output>{msg}</output>}
    </form>
  );
}
