// Server-side Supabase helpers for the file-free content store.
// Reads use the anon key (public SELECT policy); writes use the service-role key.

const RAW_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SB_URL = RAW_URL.trim().replace(/\/+$/, "").replace(/\/(rest|auth|storage)\/v1$/, "");
const ANON = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/** Can we read content from Supabase? */
export const sbReadable = Boolean(SB_URL && ANON && !SB_URL.includes("your-project"));
/** Can we persist content to Supabase? */
export const sbWritable = Boolean(SB_URL && SERVICE && !SB_URL.includes("your-project"));

type Json = unknown;

/** Read one content_store row's `data`, or null when absent/unreachable. */
export async function sbGet(key: string): Promise<Json | null> {
  if (!sbReadable) return null;
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/content_store?key=eq.${encodeURIComponent(key)}&select=data`,
      { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` }, cache: "no-store" },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as { data: Json }[];
    return rows[0]?.data ?? null;
  } catch {
    return null;
  }
}

/** Upsert one content_store row. Requires the service-role key. */
export async function sbSet(key: string, data: Json): Promise<void> {
  if (!sbWritable) throw new Error("Supabase service-role key is not configured.");
  const res = await fetch(`${SB_URL}/rest/v1/content_store`, {
    method: "POST",
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ key, data, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    throw new Error(`Content save failed (${res.status}): ${await res.text().catch(() => "")}`);
  }
}

/** Upload an image to the public `media` bucket, return its public URL. */
export async function sbUploadImage(body: Buffer, name: string, contentType: string): Promise<string> {
  if (!sbWritable) throw new Error("Supabase service-role key is not configured.");
  const path = `${Date.now().toString(36)}-${name}`;
  const res = await fetch(`${SB_URL}/storage/v1/object/media/${encodeURIComponent(path)}`, {
    method: "POST",
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body: new Uint8Array(body),
  });
  if (!res.ok) {
    throw new Error(`Image upload failed (${res.status}): ${await res.text().catch(() => "")}`);
  }
  return `${SB_URL}/storage/v1/object/public/media/${encodeURIComponent(path)}`;
}
