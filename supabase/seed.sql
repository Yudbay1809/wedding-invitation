-- Dummy seed data (local dev)
insert into auth.instances (id, uuid, raw_base_config, created_at, updated_at)
values (
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  null,
  now(),
  now()
)
on conflict (id) do nothing;

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin, email_confirmed_at
)
values (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@admin',
  crypt('admin', gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  false,
  now()
)
on conflict (id) do nothing;

insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  jsonb_build_object('sub', '00000000-0000-0000-0000-000000000000', 'email', 'admin@admin', 'email_verified', true),
  'email',
  now(),
  now(),
  now()
)
on conflict (provider_id, provider) do nothing;

insert into profiles (id, full_name, username, phone, role)
values ('00000000-0000-0000-0000-000000000000', 'Demo Admin', 'admin', '081234567890', 'admin')
on conflict (id) do nothing;

insert into invitations (id, user_id, title, slug, theme, status, published_at)
values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'Raisa & Dimas', 'raisa-dimas', 'classic', 'published', now()),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'Demo Classic', 'demo-classic', 'classic', 'published', now()),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'Demo Minimal', 'demo-minimal', 'minimal', 'published', now()),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'Demo Romantic', 'demo-romantic', 'romantic', 'published', now()),
  ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'Demo Luxury', 'demo-luxury', 'luxury', 'published', now()),
  ('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'Demo Boho', 'demo-boho', 'boho', 'published', now()),
  ('77777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', 'Demo Garden', 'demo-garden', 'garden', 'published', now()),
  ('88888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000', 'Demo Modern', 'demo-modern', 'modern', 'published', now()),
  ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000000', 'Demo Celestial', 'demo-celestial', 'celestial', 'published', now());

insert into invitation_couples (invitation_id, bride_name, groom_name, love_story)
values
  ('11111111-1111-1111-1111-111111111111', 'Raisa', 'Dimas', 'Bertemu di kampus dan memulai perjalanan bersama.');

insert into invitation_events (invitation_id, akad_date, akad_time, akad_venue, reception_date, reception_time, reception_venue, maps_link)
values
  ('11111111-1111-1111-1111-111111111111', '2026-06-21', '09:00', 'Gedung Serbaguna', '2026-06-21', '19:00', 'Ballroom Hotel', 'https://maps.google.com');

insert into invitation_gallery (invitation_id, image_url, position)
values
  ('11111111-1111-1111-1111-111111111111', 'https://example.com/1.jpg', 1),
  ('11111111-1111-1111-1111-111111111111', 'https://example.com/2.jpg', 2);

insert into invitation_guests (invitation_id, name, token, max_guests)
values
  ('11111111-1111-1111-1111-111111111111', 'Ayu Prameswari', 'demo-guest-ayu', 2),
  ('11111111-1111-1111-1111-111111111111', 'Doni Saputra', 'demo-guest-doni', 1);

insert into gift_accounts (invitation_id, bank_name, account_number, account_holder)
values
  ('11111111-1111-1111-1111-111111111111', 'BCA', '1234567890', 'Raisa');

insert into rsvps (invitation_id, name, whatsapp, guest_count, status, message)
values
  ('11111111-1111-1111-1111-111111111111', 'Ayu', '0812345678', 2, 'attending', 'Sampai jumpa di hari bahagia'),
  ('11111111-1111-1111-1111-111111111111', 'Doni', '0812987654', 1, 'declined', 'Maaf belum bisa hadir');

insert into guest_messages (invitation_id, name, message, is_hidden)
values
  ('11111111-1111-1111-1111-111111111111', 'Rina', 'Semoga bahagia selalu', false),
  ('11111111-1111-1111-1111-111111111111', 'Bagas', 'Selamat menempuh hidup baru', true);

insert into invitation_views (invitation_id)
values
  ('11111111-1111-1111-1111-111111111111'),
  ('11111111-1111-1111-1111-111111111111'),
  ('11111111-1111-1111-1111-111111111111');
