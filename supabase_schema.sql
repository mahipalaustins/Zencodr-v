-- Enable Row Level Security (RLS) is generally recommended, 
-- but for this MVP we will keep it simple or enable it with public access policies if needed.
-- Ideally, we should secure it, but for a quick start, we just create tables.

-- 1. Rooms Table
create table if not exists rooms (
  id uuid default gen_random_uuid() primary key,
  room_id text unique not null,
  language text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Messages Table
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  room_id text references rooms(room_id),
  user_id text not null,
  username text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Signaling Table (for WebRTC)
create table if not exists signaling (
  id uuid default gen_random_uuid() primary key,
  room_id text references rooms(room_id),
  from_user text not null,
  to_user text,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Realtime
-- You must manually enable Realtime in the Supabase Dashboard:
-- Go to Database -> Replication -> Click 'supabase_realtime' -> Toggle 'messages' and 'signaling' tables.

-- setup RLS (Optional but recommended to avoid warnings)
alter table rooms enable row level security;
alter table messages enable row level security;
alter table signaling enable row level security;

-- Allow public access (MVP Style - Warning: Insecure for production)
create policy "Public Rooms" on rooms for all using (true) with check (true);
create policy "Public Messages" on messages for all using (true) with check (true);
create policy "Public Signaling" on signaling for all using (true) with check (true);
