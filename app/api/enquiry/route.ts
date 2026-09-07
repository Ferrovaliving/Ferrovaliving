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

type Body = { name?: string; email?: string; phone?: string; kind?: string; message?: string };

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] || c));

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 60);
  const kind = clean(body.kind, 40) || "general";
  const message = clean(body.message, 5000);

  if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 422 });
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
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
      body: JSON.stringify({ name, email, phone, kind, message, status: "new" }),
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

  // Best-effort notification — never fail the submission over email trouble.
  if (RESEND_KEY && NOTIFY_TO) {
    const rows: [string, string][] = [
      ["Name", name],
      ["Email", email || "—"],
      ["Phone", phone || "—"],
      ["Type", kind],
    ];
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: NOTIFY_FROM,
          to: [NOTIFY_TO],
          reply_to: email || undefined,
          subject: `New enquiry — ${name}`,
          text:
            rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\n${message || "(no message)"}`,
          html:
            `<h2 style="font-family:Georgia,serif;color:#261d18">New enquiry</h2>` +
            `<table style="font-family:Arial,sans-serif;font-size:14px;color:#33291f;border-collapse:collapse">` +
            rows
              .map(
                ([k, v]) =>
                  `<tr><td style="padding:4px 16px 4px 0;color:#9a8d7e">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`,
              )
              .join("") +
            `</table><p style="font-family:Georgia,serif;font-size:15px;color:#33291f;white-space:pre-wrap;background:#faf6ee;border:1px solid #ece0cc;border-radius:6px;padding:12px 14px">${esc(message || "(no message)")}</p>`,
        }),
      });
    } catch (e) {
      console.error("enquiry email failed", e);
    }
  }

  return NextResponse.json({ ok: true, stored: true });
}
