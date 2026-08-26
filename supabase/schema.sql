-- Auction War Room — active-season sync (run in Supabase SQL editor)
-- Security model: knowledge of the sync code (hashed client-side) is the secret.
-- Direct table access is denied; only RPCs may read/write by hash.

create table if not exists public.season_sync (
  sync_code_hash text primary key,
  season_id text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.season_sync enable row level security;

-- No direct anon policies on the table (deny by default when RLS is on).

create or replace function public.fetch_season_sync(p_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.season_sync%rowtype;
begin
  if p_hash is null or length(p_hash) < 32 then
    return null;
  end if;
  select * into row from public.season_sync where sync_code_hash = p_hash;
  if not found then
    return null;
  end if;
  return jsonb_build_object(
    'season_id', row.season_id,
    'payload', row.payload,
    'updated_at', row.updated_at
  );
end;
$$;

create or replace function public.upsert_season_sync(p_hash text, p_season_id text, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_hash is null or length(p_hash) < 32 then
    raise exception 'invalid hash';
  end if;
  if p_payload is null then
    raise exception 'payload required';
  end if;
  insert into public.season_sync (sync_code_hash, season_id, payload, updated_at)
  values (p_hash, coalesce(p_season_id, ''), p_payload, now())
  on conflict (sync_code_hash) do update
    set season_id = excluded.season_id,
        payload = excluded.payload,
        updated_at = now();
  return jsonb_build_object('ok', true, 'updated_at', now());
end;
$$;

revoke all on public.season_sync from anon, authenticated;
grant execute on function public.fetch_season_sync(text) to anon, authenticated;
grant execute on function public.upsert_season_sync(text, text, jsonb) to anon, authenticated;
