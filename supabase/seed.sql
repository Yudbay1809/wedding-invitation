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
  'admin@admin.com',
  crypt('admin123', gen_salt('bf')),
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
  jsonb_build_object('sub', '00000000-0000-0000-0000-000000000000', 'email', 'admin@admin.com', 'email_verified', true),
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
  ('11111111-1111-1111-1111-111111111111', 'Raisa', 'Dimas', 'Bertemu di kampus dan memulai perjalanan bersama.'),
  ('22222222-2222-2222-2222-222222222222', 'Nadia', 'Arga', 'Sahabat masa kecil yang kembali dipertemukan.'),
  ('33333333-3333-3333-3333-333333333333', 'Alya', 'Rafi', 'Perjalanan cinta yang sederhana namun bermakna.'),
  ('44444444-4444-4444-4444-444444444444', 'Cinta', 'Dion', 'Di antara bunga dan senja, kami memilih selamanya.'),
  ('55555555-5555-5555-5555-555555555555', 'Elena', 'Rico', 'Janji indah di malam penuh cahaya.'),
  ('66666666-6666-6666-6666-666666666666', 'Kiara', 'Hadi', 'Cerita hangat di bawah matahari senja.'),
  ('77777777-7777-7777-7777-777777777777', 'Maya', 'Reno', 'Di taman hijau kami merayakan cinta.'),
  ('88888888-8888-8888-8888-888888888888', 'Sena', 'Raka', 'Urban love dengan ritme modern.'),
  ('99999999-9999-9999-9999-999999999999', 'Luna', 'Arga', 'Seperti bintang, kisah kami menyala terang.')
on conflict (invitation_id) do nothing;

insert into invitation_events (invitation_id, akad_date, akad_time, akad_venue, reception_date, reception_time, reception_venue, maps_link)
values
  ('11111111-1111-1111-1111-111111111111', '2026-06-21', '09:00', 'Gedung Serbaguna', '2026-06-21', '19:00', 'Ballroom Hotel', 'https://maps.google.com'),
  ('22222222-2222-2222-2222-222222222222', '2026-07-10', '09:00', 'Grand Hall', '2026-07-10', '18:30', 'Sky Ballroom', 'https://maps.google.com'),
  ('33333333-3333-3333-3333-333333333333', '2026-08-02', '09:30', 'The Chapel', '2026-08-02', '19:00', 'Nusa Hall', 'https://maps.google.com'),
  ('44444444-4444-4444-4444-444444444444', '2026-08-20', '10:00', 'Lotus Garden', '2026-08-20', '19:30', 'Orchid Pavilion', 'https://maps.google.com'),
  ('55555555-5555-5555-5555-555555555555', '2026-09-05', '10:00', 'Luxury Hall', '2026-09-05', '19:00', 'Golden Ballroom', 'https://maps.google.com'),
  ('66666666-6666-6666-6666-666666666666', '2026-09-18', '16:00', 'Sunset Deck', '2026-09-18', '19:30', 'Boho Lounge', 'https://maps.google.com'),
  ('77777777-7777-7777-7777-777777777777', '2026-10-02', '15:30', 'Garden Terrace', '2026-10-02', '19:00', 'Greenhouse Hall', 'https://maps.google.com'),
  ('88888888-8888-8888-8888-888888888888', '2026-10-18', '09:00', 'City Hall', '2026-10-18', '20:00', 'Downtown Loft', 'https://maps.google.com'),
  ('99999999-9999-9999-9999-999999999999', '2026-11-01', '18:00', 'Star Pavilion', '2026-11-01', '20:30', 'Celestial Dome', 'https://maps.google.com')
on conflict (invitation_id) do nothing;

insert into invitation_gallery (invitation_id, image_url, position)
values
  ('11111111-1111-1111-1111-111111111111', '/assets/wedding-1.jpg', 1),
  ('11111111-1111-1111-1111-111111111111', '/assets/wedding-2.jpg', 2),
  ('22222222-2222-2222-2222-222222222222', '/assets/wedding-3.jpg', 1),
  ('22222222-2222-2222-2222-222222222222', '/assets/wedding-4.jpg', 2),
  ('33333333-3333-3333-3333-333333333333', '/assets/wedding-2.jpg', 1),
  ('33333333-3333-3333-3333-333333333333', '/assets/wedding-3.jpg', 2),
  ('44444444-4444-4444-4444-444444444444', '/assets/wedding-1.jpg', 1),
  ('44444444-4444-4444-4444-444444444444', '/assets/wedding-4.jpg', 2),
  ('55555555-5555-5555-5555-555555555555', '/assets/wedding-4.jpg', 1),
  ('55555555-5555-5555-5555-555555555555', '/assets/wedding-3.jpg', 2),
  ('66666666-6666-6666-6666-666666666666', '/assets/wedding-1.jpg', 1),
  ('66666666-6666-6666-6666-666666666666', '/assets/wedding-2.jpg', 2),
  ('77777777-7777-7777-7777-777777777777', '/assets/wedding-2.jpg', 1),
  ('77777777-7777-7777-7777-777777777777', '/assets/wedding-4.jpg', 2),
  ('88888888-8888-8888-8888-888888888888', '/assets/wedding-3.jpg', 1),
  ('88888888-8888-8888-8888-888888888888', '/assets/wedding-1.jpg', 2),
  ('99999999-9999-9999-9999-999999999999', '/assets/wedding-4.jpg', 1),
  ('99999999-9999-9999-9999-999999999999', '/assets/wedding-2.jpg', 2)
on conflict do nothing;

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
