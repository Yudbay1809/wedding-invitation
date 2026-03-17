-- Add updated_at to invitations
alter table invitations add column if not exists updated_at timestamptz default now();
update invitations set updated_at = coalesce(updated_at, created_at, now());