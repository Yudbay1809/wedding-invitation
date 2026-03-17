create table if not exists invitation_guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations on delete cascade,
  name text not null,
  token text not null unique,
  max_guests int default 1,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table rsvps add column if not exists guest_id uuid references invitation_guests on delete set null;

alter table invitation_guests enable row level security;

create policy "guests_owner" on invitation_guests for all using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
) with check (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
);

create policy "guests_admin_read" on invitation_guests for select using (is_admin());

create or replace function public.get_guest_by_token(p_invitation_id uuid, p_token text)
returns table (id uuid, name text, max_guests int)
language sql
security definer
set search_path = public
as $$
  select g.id, g.name, g.max_guests
  from invitation_guests g
  join invitations i on i.id = g.invitation_id
  where g.invitation_id = p_invitation_id
    and g.token = p_token
    and g.is_active = true
    and i.status = 'published'
  limit 1;
$$;

grant execute on function public.get_guest_by_token(uuid, text) to anon, authenticated;
