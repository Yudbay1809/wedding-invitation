create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  invitation_id uuid references invitations on delete set null,
  plan text,
  addon_theme text,
  amount numeric,
  currency text default 'IDR',
  created_at timestamptz default now()
);

alter table transactions enable row level security;

create policy "transactions_admin_read" on transactions for select using (is_admin());
create policy "transactions_admin_insert" on transactions for insert with check (is_admin());
