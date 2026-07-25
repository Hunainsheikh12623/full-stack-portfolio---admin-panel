create table if not exists public.portfolio_state (
  id text primary key check (id = 'primary'),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_state enable row level security;

-- The Express server uses the service-role/secret key; browsers never access this table directly.
revoke all on public.portfolio_state from anon, authenticated;

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

-- Uploads are made only by the server with its secret key. Public read access lets the portfolio render asset URLs.
drop policy if exists "Public portfolio media is readable" on storage.objects;
create policy "Public portfolio media is readable"
on storage.objects for select
to public
using (bucket_id = 'portfolio-media');
