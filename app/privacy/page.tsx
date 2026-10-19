import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Ferrova Living handles enquiries and the data used by Ferrova CRM.",
};

const UPDATED = "19 October 2026";

export default function PrivacyPage() {
  return (
    <main className="simple legal">
      <nav>
        <Link href="/">← Ferrova Living</Link>
        <Link href="/contact">Contact ↗</Link>
      </nav>
      <section>
        <p>LEGAL</p>
        <h1>Privacy Policy</h1>
        <article>
          Ferrova Living (Udaipur, Rajasthan, India) respects your privacy. This page explains what we collect through
          this website and through Ferrova CRM, our internal business application, and how we use it.
        </article>
        <small>Last updated: {UPDATED}</small>

        <h2>1. Enquiries made on this website</h2>
        <p>
          When you send an enquiry we collect the details you enter: your name, phone number, email address, the type of
          project and your message. We use them only to reply to you, prepare quotations and deliver your order. Enquiries
          are stored securely with our database provider (Supabase), and we receive a notification by email and WhatsApp.
          We do not sell, rent or share your details with anyone for marketing.
        </p>

        <h2>2. Ferrova CRM and Google user data</h2>
        <p>
          Ferrova CRM is a private application used only by Ferrova Living staff to manage customers, quotations,
          invoices and payments. It is not offered to the public. When a Ferrova Living administrator connects a Google
          account, the CRM requests these permissions:
        </p>
        <ul>
          <li>
            <b>Google Drive — files created by this app only</b> (<code>drive.file</code>): to save the business documents
            it generates (quotations, invoices, receipts, reports, backups) and files our staff upload, in a
            &ldquo;Ferrova Living CRM&rdquo; folder. The app cannot see, read or change any other file in the Drive.
          </li>
          <li>
            <b>Email address</b> (<code>userinfo.email</code>): to show which Google account is connected.
          </li>
        </ul>
        <p>
          Google user data is used solely to provide these storage features. It is not used for advertising, not sold, and
          not transferred to anyone except as needed to provide the feature, comply with law, or protect our rights. No
          humans read it except our own staff using the CRM, or where you have asked us to, or where required by law.
          Access tokens are encrypted and kept only on our server; they are never shared or exposed in a browser.
        </p>
        <p>
          Ferrova CRM&apos;s use and transfer of information received from Google APIs adheres to the{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>

        <h2>3. Business records</h2>
        <p>
          For customers we work with, we keep the records needed to run the business and meet Indian GST and tax rules —
          such as quotations, invoices, GSTIN and payment details — for as long as the law requires.
        </p>

        <h2>4. Your choices</h2>
        <p>
          You can ask us to see, correct or delete your personal details (subject to records we must keep by law) by
          writing to <a href="mailto:ferrovaliving@gmail.com">ferrovaliving@gmail.com</a> or calling{" "}
          <a href="tel:+919024807898">+91 90248 07898</a>. A connected Google account can be disconnected at any time from
          the CRM or from{" "}
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">myaccount.google.com/permissions</a>.
        </p>

        <h2>5. Security</h2>
        <p>
          Data is sent over encrypted connections (HTTPS), the CRM requires a staff login, and stored credentials are
          hashed or encrypted.
        </p>

        <h2>6. Changes</h2>
        <p>If this policy changes we will update this page and the date above.</p>

        <h2>Contact</h2>
        <p>
          Ferrova Living, Udaipur, Rajasthan, India · <a href="mailto:ferrovaliving@gmail.com">ferrovaliving@gmail.com</a> ·{" "}
          <a href="tel:+919024807898">+91 90248 07898</a>
        </p>
      </section>
    </main>
  );
}
