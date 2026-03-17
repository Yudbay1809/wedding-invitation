-- Add watermark toggle on invitations
alter table invitations add column if not exists show_watermark boolean default true;