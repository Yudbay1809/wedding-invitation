-- Allow admin to update invitations (suspend/restore)
drop policy if exists "invitations_admin_update" on invitations;
create policy "invitations_admin_update" on invitations for update using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
