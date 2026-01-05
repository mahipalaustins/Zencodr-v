-- ==========================================
-- COMPLETE ZENCODR DATABASE SETUP
-- Run this entire script in your Supabase SQL Editor
-- ==========================================

-- 1. Enable RLS (Security)
alter table if exists rooms enable row level security;
alter table if exists messages enable row level security;
alter table if exists signaling enable row level security;
alter table if exists app_users enable row level security;

-- 2. Create Rooms Table
create table if not exists rooms (
  id uuid default gen_random_uuid() primary key,
  room_id text unique not null,
  language text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Messages Table
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  room_id text references rooms(room_id),
  user_id text not null,
  username text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Signaling Table (CRITICAL for Voice Call)
create table if not exists signaling (
  id uuid default gen_random_uuid() primary key,
  room_id text references rooms(room_id),
  from_user text not null,
  to_user text,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Custom Users Table (For Login/Signup)
create table if not exists app_users (
  id uuid default gen_random_uuid() primary key,
  username text unique not null,
  email text unique not null,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Setup Policies (Allow Public Access for MVP Simplicity)
-- Note: In production, you would lock this down.

-- Rooms
drop policy if exists "Public Rooms" on rooms;
create policy "Public Rooms" on rooms for all using (true) with check (true);

-- Messages
drop policy if exists "Public Messages" on messages;
create policy "Public Messages" on messages for all using (true) with check (true);

-- Signaling
drop policy if exists "Public Signaling" on signaling;
create policy "Public Signaling" on signaling for all using (true) with check (true);

-- Users
drop policy if exists "Public App Users" on app_users;
create policy "Public App Users" on app_users for all using (true) with check (true);

-- 7. ENABLE REALTIME
-- Note: You must ALSO Enable Realtime in the Supabase Dashboard UI
-- Go to Database -> Replication -> Click 'supabase_realtime' -> Toggle ON for:
-- [x] messages
-- [x] signaling
