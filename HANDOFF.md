# Ferrova Living website and CMS

This package contains the complete Next.js website, custom Supabase CMS, database schema, and Ferrova logo integration.

## Start locally

1. Install Node.js 22 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and enter the Supabase project URL and publishable key.
4. Run `npm run dev`.
5. Open `http://localhost:3000` for the website and `http://localhost:3000/admin` for the CMS.

## Editing site content

Every part of the public site is editable from the admin studio, no code changes:

- `/admin/site` — navigation, hero (text + background image), material strip, all section
  headings, Why-Choose-Us, FAQ, the enquiry form (copy + budget options), footer,
  contact details (phone/WhatsApp/email/address/hours/Instagram) and SEO.
- `/admin/catalog`, `/admin/projects`, `/admin/testimonials`, `/admin/about` — the lists.

Content is stored in `data/content.json` and `data/catalog.json`. Editing writes to disk, so
it works when running locally; on Vercel the filesystem is read-only, so to change the live
site edit locally (or the JSON files directly), commit, and redeploy.

## Database

The Supabase database definition and policies are in `supabase/schema.sql`. Do not run the complete file again against the existing production project unless you intend to recreate its schema.

## Production

The current live website is `https://ferrova-living-site.vercel.app`.

## Important security note

Passwords, private Supabase credentials, local sessions, build caches, and installed dependencies are intentionally not included. Give collaborators access through Supabase and Vercel team invitations instead of sharing account passwords.
