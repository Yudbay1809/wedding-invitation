-- Admin activity log + audit trail
create table if not exists admin_activity (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references profiles(id) on delete cascade,
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table admin_activity enable row level security;

create policy "admin_activity_select" on admin_activity
  for select
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

create policy "admin_activity_insert" on admin_activity
  for insert
  with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
