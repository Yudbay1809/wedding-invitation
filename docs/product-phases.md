# WedSaaS Product Phases (Airbnb-Class Quality)

This roadmap is the single source of truth for delivery phases. Each phase is
scoped to keep the UX premium, consistent, and production-ready.

## Phase 0 — Foundation & Quality Baseline
1. Fix runtime/build errors (App Router, Supabase config, hydration).
2. Lint clean + build clean.
3. Supabase local working (Auth + DB + Storage).
4. Env setup standardized (local + prod).
5. Error boundary + empty states consistent.

## Phase 1 — Dashboard Core UX
1. Overview: stat cards + trend mini + "What's next" CTA panel.
2. Invitations list: status badge clear + quick actions + empty state premium.
3. Invitation detail: header status + publish toggle + clear CTAs.
4. Consistent spacing, typography scale, layout rhythm.

## Phase 2 — Builder UX Premium
1. Sticky sidebar navigation per section.
2. Section collapse/expand.
3. Inline validation + error hints.
4. Autosave premium: toast + timestamp + status indicator.
5. Preview & Publish flow (draft/published/archived).
6. Theme selector: locked theme handling + disabled states.

## Phase 3 — Public Invite Page (Signature + Motion)
1. 8 signature themes with real typography + layout differences.
2. Motion system: staggered reveal + subtle parallax.
3. CTA RSVP prominent (mobile sticky button).
4. Storytelling flow: opening → story → event → RSVP → gift → closing.
5. Countdown + music player polished.

## Phase 4 — RSVP & Guest Messages
1. RSVP management: filters, status badges, counts.
2. Guest messages: hide/unhide, bulk actions, approval flow.
3. Public RSVP: inline errors + success feedback.

## Phase 5 — Gallery & Media
1. Supabase Storage upload + reorder + delete.
2. Gallery lightbox.
3. Cover/logo/white-label uploads.

## Phase 6 — Analytics Real
1. View tracking (per invitation).
2. Daily trends (views, RSVP, messages).
3. Conversion rate cards.
4. Empty states + helper copy.

## Phase 7 — Plans & Gating
1. FREE/PREMIUM/BUSINESS gating.
2. Theme lock by plan or transaction.
3. Watermark toggle.
4. Feature flags per plan (gift, analytics, white-label).

## Phase 8 — Admin & Tenant Control
1. Admin dashboard (tenant list, stats).
2. Admin: set theme per invitation/user.
3. Bulk suspend invitations.
4. Transactions: price preview + status (paid/pending/refund).
5. Export CSV transaksi.

## Phase 9 — Go-Live
1. SEO: meta, OG, sitemap, robots.
2. Performance: image optimization, font loading, caching.
3. Analytics integration (GA/Plausible).
4. Final QA: mobile-first + accessibility.
