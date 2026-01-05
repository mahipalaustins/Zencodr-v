-- Custom Users Table for specific "App-Level" Auth
-- Use this if you want to bypass Supabase's built-in Auth system
-- and just manage users in a standard table.

create table if not exists app_users (
  id uuid default gen_random_uuid() primary key,
  username text unique not null,
  email text unique not null,
  password text not null, -- WARNING: Storing passwords in plain text/simple hash is not secure for production.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Allow anyone to read/write to this table (Simulates open registration)
alter table app_users enable row level security;
create policy "Public Access" on app_users for all using (true) with check (true);
