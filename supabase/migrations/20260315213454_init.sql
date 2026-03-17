-- Schema for WedSaaS

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  phone text,
  role text default 'user',
  created_at timestamptz default now()
);

create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  slug text not null unique,
  theme text default 'classic',
  status text default 'draft',
  cover_image_url text,
  opening_quote text,
  closing_message text,
  wedding_hashtag text,
  livestream_link text,
  background_music text,
  enable_rsvp boolean default true,
  max_guests int,
  rsvp_deadline date,
  accent_color text,
  preview_link text,
  published_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists invitation_couples (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations on delete cascade unique,
  bride_name text,
  groom_name text,
  bride_parents text,
  groom_parents text,
  love_story text
);

create table if not exists invitation_events (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations on delete cascade unique,
  akad_date date,
  akad_time time,
  akad_venue text,
  reception_date date,
  reception_time time,
  reception_venue text,
  maps_link text
);

create table if not exists invitation_gallery (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations on delete cascade,
  image_url text,
  position int default 0
);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations on delete cascade,
  name text not null,
  whatsapp text,
  guest_count int default 1,
  status text default 'pending',
  message text,
  created_at timestamptz default now()
);

create table if not exists guest_messages (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations on delete cascade,
  name text not null,
  message text not null,
  is_hidden boolean default false,
  created_at timestamptz default now()
);

create table if not exists gift_accounts (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations on delete cascade unique,
  bank_name text,
  account_number text,
  account_holder text,
  wallet_name text,
  wallet_number text
);

create table if not exists gift_confirmations (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations on delete cascade,
  name text not null,
  amount numeric,
  message text,
  created_at timestamptz default now()
);

create table if not exists invitation_views (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations on delete cascade,
  viewed_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  plan text default 'free',
  status text default 'active',
  current_period_end timestamptz,
  created_at timestamptz default now()
);

create table if not exists white_label_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  brand_name text,
  logo_url text,
  custom_domain text,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table invitations enable row level security;
alter table invitation_couples enable row level security;
alter table invitation_events enable row level security;
alter table invitation_gallery enable row level security;
alter table rsvps enable row level security;
alter table guest_messages enable row level security;
alter table gift_accounts enable row level security;
alter table gift_confirmations enable row level security;
alter table invitation_views enable row level security;
alter table subscriptions enable row level security;
alter table white_label_settings enable row level security;

-- Profiles
create policy "profiles_self_read" on profiles for select using (auth.uid() = id);
create policy "profiles_self_write" on profiles for insert with check (auth.uid() = id);
create policy "profiles_self_update" on profiles for update using (auth.uid() = id);
create policy "profiles_admin_read" on profiles for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Invitations
create policy "invitations_owner_read" on invitations for select using (auth.uid() = user_id);
create policy "invitations_owner_write" on invitations for insert with check (auth.uid() = user_id);
create policy "invitations_owner_update" on invitations for update using (auth.uid() = user_id);
create policy "invitations_admin_read" on invitations for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Public read for published invitations
create policy "invitations_public_read" on invitations for select using (status = 'published');

-- Related tables owner read/write
create policy "couples_owner" on invitation_couples for all using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
) with check (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
);

create policy "events_owner" on invitation_events for all using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
) with check (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
);

create policy "gallery_owner" on invitation_gallery for all using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
) with check (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
);

create policy "gift_accounts_owner" on gift_accounts for all using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
) with check (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
);

-- Public read for published invitation data
create policy "couples_public_read" on invitation_couples for select using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.status = 'published')
);
create policy "events_public_read" on invitation_events for select using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.status = 'published')
);
create policy "gallery_public_read" on invitation_gallery for select using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.status = 'published')
);
create policy "gift_public_read" on gift_accounts for select using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.status = 'published')
);

create policy "views_public_insert" on invitation_views for insert with check (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.status = 'published')
);
create policy "views_owner_read" on invitation_views for select using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
);
create policy "views_admin_read" on invitation_views for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- RSVP and guest messages: public insert, owner read
create policy "rsvps_owner_read" on rsvps for select using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
);
create policy "rsvps_public_insert" on rsvps for insert with check (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.status = 'published')
);

create policy "messages_owner_read" on guest_messages for select using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
);
create policy "messages_owner_update" on guest_messages for update using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
);
create policy "messages_public_insert" on guest_messages for insert with check (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.status = 'published')
);

create policy "gift_confirm_owner_read" on gift_confirmations for select using (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.user_id = auth.uid())
);
create policy "gift_confirm_public_insert" on gift_confirmations for insert with check (
  exists (select 1 from invitations where invitations.id = invitation_id and invitations.status = 'published')
);

-- Subscriptions and white label
create policy "subscriptions_owner" on subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "white_label_owner" on white_label_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "subscriptions_admin" on subscriptions for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "guest_messages_admin_read" on guest_messages for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "rsvps_admin_read" on rsvps for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "gift_confirm_admin_read" on gift_confirmations for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('covers', 'covers', true),
  ('couple-photos', 'couple-photos', true),
  ('gallery', 'gallery', true),
  ('white-label', 'white-label', true)
on conflict (id) do nothing;

-- Storage policies
create policy "gallery_upload" on storage.objects for insert
  with check (bucket_id = 'gallery' and auth.role() = 'authenticated');
create policy "gallery_public_read" on storage.objects for select
  using (bucket_id = 'gallery');

create policy "covers_upload" on storage.objects for insert
  with check (bucket_id = 'covers' and auth.role() = 'authenticated');
create policy "covers_public_read" on storage.objects for select
  using (bucket_id = 'covers');

create policy "white_label_upload" on storage.objects for insert
  with check (bucket_id = 'white-label' and auth.role() = 'authenticated');
create policy "white_label_public_read" on storage.objects for select
  using (bucket_id = 'white-label');

create policy "couple_photos_upload" on storage.objects for insert
  with check (bucket_id = 'couple-photos' and auth.role() = 'authenticated');
create policy "couple_photos_public_read" on storage.objects for select
  using (bucket_id = 'couple-photos');
