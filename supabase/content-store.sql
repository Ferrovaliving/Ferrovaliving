-- Live content store. Run once in Supabase → SQL Editor.
-- Lets /admin edits publish to the deployed site with no redeploy.
-- Requires the base schema (schema.sql) to have run first, for is_admin().

create table if not exists public.content_store (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.content_store enable row level security;

drop policy if exists "public read content" on public.content_store;
create policy "public read content" on public.content_store
  for select to anon, authenticated using (true);

drop policy if exists "admins write content" on public.content_store;
create policy "admins write content" on public.content_store
  for all to authenticated using (is_admin()) with check (is_admin());

grant select on public.content_store to anon, authenticated;
