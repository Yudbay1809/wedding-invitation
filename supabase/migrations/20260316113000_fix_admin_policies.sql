-- Fix admin policies with security definer to avoid recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- Profiles
drop policy if exists "profiles_admin_read" on profiles;
create policy "profiles_admin_read" on profiles for select using (is_admin());

-- Invitations
drop policy if exists "invitations_admin_read" on invitations;
create policy "invitations_admin_read" on invitations for select using (is_admin());

drop policy if exists "invitations_admin_update" on invitations;
create policy "invitations_admin_update" on invitations for update using (is_admin());

-- Views
drop policy if exists "views_admin_read" on invitation_views;
create policy "views_admin_read" on invitation_views for select using (is_admin());

-- Subscriptions
drop policy if exists "subscriptions_admin" on subscriptions;
create policy "subscriptions_admin" on subscriptions for all using (is_admin()) with check (is_admin());

-- Guest Messages / RSVP / Gift Confirm
drop policy if exists "guest_messages_admin_read" on guest_messages;
create policy "guest_messages_admin_read" on guest_messages for select using (is_admin());

drop policy if exists "rsvps_admin_read" on rsvps;
create policy "rsvps_admin_read" on rsvps for select using (is_admin());

drop policy if exists "gift_confirm_admin_read" on gift_confirmations;
create policy "gift_confirm_admin_read" on gift_confirmations for select using (is_admin());