# Ferrova Living — production setup

The site runs fine with no configuration (content comes from `data/*.json`).
These steps turn on the optional pieces.

## 1. Protect the admin studio (2 min)

`/admin` and its editors are reachable by anyone until you set a password.

1. In Vercel → **Project → Settings → Environment Variables**, add:
   - `ADMIN_PASSWORD` = a strong password — all environments
2. Redeploy (Vercel → Deployments → ⋯ → Redeploy), or just push any commit.

Now `/admin/*` prompts for Basic Auth. Username can be anything; password is the value above.

## 2. Fix the canonical URL (optional, 1 min)

SEO tags, `sitemap.xml` and `robots.txt` auto-use the Vercel deployment URL.
If you add a custom domain, set:

- `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com` — all environments

## 3. Store enquiries + enable the login (Supabase, ~15 min)

Until this is done, the enquiry forms show a success message but save nothing.

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste the contents of [`supabase/schema.sql`](supabase/schema.sql) → Run.
   (Run it once. It creates tables, row-level-security policies, the `media`
   storage bucket and sample rows.)
3. **Authentication → Users → Add user** → create your admin account (email + password).
   Copy that user's UUID.
4. **SQL Editor** → run, with the UUID pasted in:
   ```sql
   insert into profiles (id, full_name, role)
   values ('PASTE-UUID-HERE', 'Ferrova Administrator', 'admin');
   ```
5. **Project Settings → API** → copy the values into Vercel env vars (all environments):
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `anon` `public` key
   - `SUPABASE_SERVICE_ROLE_KEY` = `service_role` key (keep secret)
6. **Authentication → URL Configuration** → add your site URL to **Site URL** and
   **Redirect URLs** (e.g. `https://ferrovaliving.vercel.app`).
7. Redeploy.

Then:
- The enquiry forms write to the `enquiries` table.
- Sign in at `/login`; view submissions under **Admin → Enquiries**.

## 4. Email alert on every new enquiry (optional, ~5 min)

Without this you have to keep checking `/admin`. With it, each submission also
lands in your inbox.

1. Sign up at [resend.com](https://resend.com) (free — 100 emails/day).
2. **API Keys → Create API Key** → copy it.
3. In Vercel env vars (all environments), add:
   - `RESEND_API_KEY` = the key
   - `LEAD_NOTIFY_EMAIL` = where alerts go. **On the free tier this must be the
     email you signed up to Resend with.**
4. Redeploy.

To send alerts to a different address (e.g. `ferrovaliving@gmail.com`) or from
your own domain, verify a domain in Resend → **Domains**, then also set
`LEAD_NOTIFY_FROM` = `Ferrova Living <hello@yourdomain.com>`.

The email is best-effort: if Resend is down or misconfigured, the enquiry is
still saved to the database.

### What Supabase does *not* change yet

The public pages still read all their content from `data/*.json`, edited locally
in `/admin/*` and shipped by pushing to `main`. Moving live content editing into
Supabase (so you can edit the deployed site with no redeploy) is a larger,
separate task — the schema is already there for it.
