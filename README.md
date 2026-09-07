# Ferrova Living

A responsive Next.js/TypeScript portfolio and CMS foundation for Ferrova Living. It includes the public brand site, product/project routes, enquiry form, mobile admin studio, draft/publish controls, section ordering, and a production-oriented Supabase schema.

## Run locally

1. Install Node.js 22 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add your Supabase values.
4. Run `npm run dev`, then open the shown local address.

The design opens with marked sample content. Once Supabase is connected, sign in at `/login` and manage live content at `/admin`. Without keys, the admin opens in a clearly labelled non-persistent demo mode.

## Supabase setup

Create a Supabase project, open SQL Editor, and run `supabase/schema.sql`. The script creates the secured `media` bucket, RLS policies and sample content. In Authentication, create the first user. Copy that user's UUID and run the commented `insert into profiles...` statement at the end of the schema, replacing the placeholder UUID. Only promote a known account. Never expose the service-role key in browser code.

For images, accept JPG, PNG, WebP and AVIF, validate MIME type and size, generate a unique storage path, and save metadata in `media`. Product imagery must use `object-fit: contain`; lifestyle/project thumbnails may use `cover`. Before deleting, query image relationship tables and soft-delete used media.

## Content workflow

Use **Admin → Page builder** to add a block, edit its fields, save a draft, reorder with drag or arrow controls, preview, and publish. Products and projects follow the same draft/published/hidden/archived workflow. Contact details belong in the singleton `website_settings` record so they update everywhere.

## Deployment

Push the project to GitHub, import it into Vercel, add the four environment variables from `.env.example`, and deploy. Set `NEXT_PUBLIC_SITE_URL` to the production URL. In Supabase Authentication, add the production URL and reset callback to the allowed redirect URLs.

## Backup and safety

Enable Supabase point-in-time recovery or schedule `pg_dump` backups. Export the Storage bucket separately using the Supabase CLI or S3-compatible API. Keep soft-deleted records for a defined retention window. Review `activity_logs` before permanent deletion.

## Troubleshooting

- Blank content: confirm Supabase URL/key and published status.
- Upload rejected: confirm bucket policies, administrator profile, MIME type and size.
- Login loop: confirm Site URL and redirect URLs in Supabase Auth.
- Vercel build error: use Node 22+, reinstall dependencies, then run `npm run build` locally.

Sample photography and copy are placeholders and must be replaced before launch. Add the original Ferrova logo through the setup wizard; it is intentionally not redrawn here.
