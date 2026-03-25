# WedSaaS

SaaS platform untuk undangan pernikahan digital berbasis Next.js (App Router), Supabase, dan Tailwind CSS.

[![CI](https://github.com/Yudbay1809/wedding-invitation/actions/workflows/ci.yml/badge.svg)](https://github.com/Yudbay1809/wedding-invitation/actions/workflows/ci.yml)

## Setup

1. Install dependencies

```bash
npm install
```

2. (Local) Jalankan Supabase Local (Docker + Supabase CLI)

Pastikan `supabase` CLI sudah terinstall dan Docker berjalan.

```bash
supabase start
```

Lalu cek status dan copy credentials:

```bash
supabase status
```

Isi `.env.local` dengan output URL + anon key.

3. (Local) Generate `.env.local` otomatis dari Supabase Local

```bash
npm run supabase:env
```

4. (Local) Apply schema + seed otomatis

```bash
npm run supabase:reset
```

5. (Opsional) One-command setup lokal

```bash
npm run setup:local
```

6. Buat project Supabase dan isi `.env.local` (Jika pakai cloud)

```bash
cp .env.example .env.local
```

Isi:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (opsional untuk admin tasks)
- `NEXT_PUBLIC_APP_URL`

7. Jalankan schema dan seed

Di Supabase SQL editor, jalankan:
- `supabase/schema.sql`
- `supabase/seed.sql`

8. Buat Storage buckets di Supabase
- `covers`
- `couple-photos`
- `gallery`
- `white-label`

9. (Optional) Storage policies untuk gallery

```sql
-- allow authenticated users to upload gallery files
create policy "gallery_upload" on storage.objects for insert
  with check (
    bucket_id = 'gallery' and auth.role() = 'authenticated'
  );

-- allow public read for gallery
create policy "gallery_public_read" on storage.objects for select
  using (bucket_id = 'gallery');

-- allow authenticated users to upload cover images
create policy "covers_upload" on storage.objects for insert
  with check (
    bucket_id = 'covers' and auth.role() = 'authenticated'
  );

-- allow public read for covers
create policy "covers_public_read" on storage.objects for select
  using (bucket_id = 'covers');

-- allow authenticated users to upload white-label assets
create policy "white_label_upload" on storage.objects for insert
  with check (
    bucket_id = 'white-label' and auth.role() = 'authenticated'
  );

-- allow public read for white-label assets
create policy "white_label_public_read" on storage.objects for select
  using (bucket_id = 'white-label');
```

10. Run dev server

```bash
npm run dev
```

## Local Demo Credentials

Untuk Supabase Local + `supabase db reset`, akun demo berikut otomatis tersedia:

- Admin: `admin@admin.com` / `admin123`

Catatan: pastikan Supabase Local berjalan dan `.env.local` sudah terisi.

## Demo Invite Links

Setelah `supabase db reset`, demo undangan berikut tersedia:

- `http://localhost:3000/invite/demo-classic`
- `http://localhost:3000/invite/demo-minimal`
- `http://localhost:3000/invite/demo-romantic`
- `http://localhost:3000/invite/demo-luxury`
- `http://localhost:3000/invite/demo-boho`
- `http://localhost:3000/invite/demo-garden`
- `http://localhost:3000/invite/demo-modern`
- `http://localhost:3000/invite/demo-celestial`

## CI (GitHub Actions)

Workflow CI sudah disiapkan untuk menjalankan:
- `npm ci`
- `npm run lint`
- `npm run build`

File workflow: `.github/workflows/ci.yml`

Catatan:
- Set GitHub Secrets:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deployment

### Build production

```bash
npm run build
npm run start
```

### Env minimal production

Isi `.env.local` pada server:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (opsional jika ada server task admin)
- `NEXT_PUBLIC_APP_URL` (atau `NEXT_PUBLIC_SITE_URL` untuk link demo/guest token)

### Hosting

Rekomendasi hosting:
- Vercel (paling cepat untuk Next.js App Router)
- VPS + Docker (jika ingin kontrol penuh)

## Struktur Route

- `(marketing)` landing page
- `(auth)` login / register / forgot password
- `(dashboard)/dashboard` area user
- `/invite/[slug]` halaman undangan publik
- `/admin` admin panel

## Catatan

- Middleware melindungi `/dashboard/*` dan `/admin/*`.
- Admin role disimpan di `profiles.role` (set ke `admin` untuk akses `/admin`).
- Builder tersambung ke CRUD Supabase, termasuk upload gallery.
- Analytics menggunakan table `invitation_views` (auto-insert saat halaman undangan dibuka).

