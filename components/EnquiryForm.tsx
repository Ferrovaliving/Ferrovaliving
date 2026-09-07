"use client";

import { FormEvent, useState } from "react";
import { whatsappUrl, type SiteContent } from "../lib/site-content";

export function EnquiryForm({
  enquiry,
  contact,
}: {
  enquiry: SiteContent["enquiry"];
  contact: SiteContent["contact"];
}) {
  const [sent, setSent] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitEnquiry(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const fd = new FormData(f);
    setBusy(true);
    setSent("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${fd.get("first") || ""} ${fd.get("last") || ""}`.trim(),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || ""),
          kind: "homepage",
          message: `Budget: ${fd.get("budget") || "—"}\nCity: ${fd.get("city") || "—"} ${fd.get("zip") || ""}\n${fd.get("message") || ""}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSent(data.stored ? enquiry.success : "Thanks — we’ve received your message.");
        f.reset();
      } else {
        setSent(data.error || "Unable to send enquiry. Please try WhatsApp or email.");
      }
    } catch {
      setSent("Network error — please try WhatsApp or email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="contact" className="cta">
      <p className="eyebrow">{enquiry.eyebrow}</p>
      <h2>
        {enquiry.heading}
        <br />
        <i>{enquiry.accent}</i>
      </h2>
      <form className="contactForm" onSubmit={submitEnquiry}>
        <select name="budget" className="span3" defaultValue="" required>
          <option value="" disabled>
            Select your budget
          </option>
          {enquiry.budgets.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        <input name="first" placeholder="First name" required />
        <input name="last" placeholder="Last name" />
        <textarea name="message" placeholder="How can we help you?" rows={3} />
        <input name="email" placeholder="Email address" type="email" className="span3" />
        <input name="phone" placeholder="🇮🇳 Contact number" className="span3" />
        <input name="city" placeholder="City" />
        <input name="zip" placeholder="Zipcode" />
        <button className="span3" type="submit" disabled={busy}>
          {busy ? "Sending…" : "Submit"}
        </button>
        {sent && <output className="span3">{sent}</output>}
        <p className="span3 formAlt">
          Prefer to chat?{" "}
          <a href={whatsappUrl(contact)} target="_blank" rel="noopener noreferrer">
            Message us on WhatsApp
          </a>{" "}
          or call <a href={`tel:+${contact.phoneDigits}`}>{contact.phoneDisplay}</a>.
        </p>
      </form>
    </section>
  );
}
