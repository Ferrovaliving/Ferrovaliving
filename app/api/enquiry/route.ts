import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// NEXT_PUBLIC_* values are inlined at build time; the plain names allow a
// runtime override (also handy for local testing).
const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/(rest|auth|storage)\/v1$/, "");
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_READY = Boolean(SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes("your-project"));

const RESEND_KEY = process.env.RESEND_API_KEY || "";
const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL || "";
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || "Ferrova Living <onboarding@resend.dev>";

// WhatsApp via CallMeBot (https://www.callmebot.com/blog/free-api-whatsapp-messages/)
const WA_PHONE = (process.env.WHATSAPP_TO || "").replace(/[^\d+]/g, "");
const WA_APIKEY = process.env.WHATSAPP_CALLMEBOT_APIKEY || "";

// Twilio WhatsApp (optional, more robust — needs an approved sender/template)
const TW_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TW_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TW_FROM = process.env.TWILIO_WHATSAPP_FROM || ""; // e.g. "whatsapp:+14155238886"

type Body = { name?: string; email?: string; phone?: string; kind?: string; message?: string };
type Lead = { name: string; email: string; phone: string; kind: string; message: string };

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] || c));

async function sendEmail(lead: Lead) {
  if (!RESEND_KEY || !NOTIFY_TO) return;
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Email", lead.email || "—"],
    ["Phone", lead.phone || "—"],
    ["Type", lead.kind],
  ];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_TO],
      reply_to: lead.email || undefined,
      subject: `New enquiry — ${lead.name}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\n${lead.message || "(no message)"}`,
      html:
        `<h2 style="font-family:Georgia,serif;color:#261d18">New enquiry</h2>` +
        `<table style="font-family:Arial,sans-serif;font-size:14px;color:#33291f;border-collapse:collapse">` +
        rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#9a8d7e">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`,
          )
          .join("") +
        `</table><p style="font-family:Georgia,serif;font-size:15px;color:#33291f;white-space:pre-wrap;background:#faf6ee;border:1px solid #ece0cc;border-radius:6px;padding:12px 14px">${esc(
          lead.message || "(no message)",
        )}</p>`,
    }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text().catch(() => "")}`);
}

async function sendWhatsApp(lead: Lead) {
  const text =
    `🪑 New Ferrova enquiry\n\n` +
    `Name: ${lead.name}\n` +
    `Email: ${lead.email || "—"}\n` +
    `Phone: ${lead.phone || "—"}\n` +
    `Type: ${lead.kind}\n\n` +
    `${lead.message || "(no message)"}`;

  if (WA_PHONE && WA_APIKEY) {
    const url =
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(WA_PHONE)}` +
      `&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(WA_APIKEY)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    const out = (await res.text().catch(() => "")).replace(/<[^>]+>/g, " ").trim();
    if (!res.ok || !/queued|sent/i.test(out)) {
      throw new Error(`callmebot ${res.status}: ${out.slice(0, 200)}`);
    }
    return;
  }

  if (TW_SID && TW_TOKEN && TW_FROM && WA_PHONE) {
    const form = new URLSearchParams({
      From: TW_FROM,
      To: `whatsapp:${WA_PHONE.startsWith("+") ? WA_PHONE : `+${WA_PHONE}`}`,
      Body: text,
    });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TW_SID}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${TW_SID}:${TW_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
    if (!res.ok) throw new Error(`twilio ${res.status}: ${await res.text().catch(() => "")}`);
  }
}

async function notify(lead: Lead) {
  const results = await Promise.allSettled([sendEmail(lead), sendWhatsApp(lead)]);
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`enquiry notify ${i === 0 ? "email" : "whatsapp"} failed`, r.reason);
  });
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const lead: Lead = {
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    phone: clean(body.phone, 60),
    kind: clean(body.kind, 40) || "general",
    message: clean(body.message, 5000),
  };

  if (lead.name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 422 });
  if (lead.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email))
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 422 });

  // No database configured yet — accept but don't persist.
  if (!SUPABASE_READY) return NextResponse.json({ ok: true, stored: false });

  try {
    const store = await fetch(`${SUPABASE_URL}/rest/v1/enquiries`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ ...lead, status: "new" }),
    });
    if (!store.ok) {
      console.error("enquiry insert failed", store.status, await store.text().catch(() => ""));
      return NextResponse.json(
        { error: "Could not save your enquiry. Please try WhatsApp or email." },
        { status: 502 },
      );
    }
  } catch (e) {
    console.error("enquiry insert error", e);
    return NextResponse.json(
      { error: "Could not save your enquiry. Please try WhatsApp or email." },
      { status: 502 },
    );
  }

  await notify(lead); // best-effort; never fails the submission

  return NextResponse.json({ ok: true, stored: true });
}
