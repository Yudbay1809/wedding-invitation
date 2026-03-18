alter table invitation_couples
  add column if not exists bride_photo_url text,
  add column if not exists groom_photo_url text;
