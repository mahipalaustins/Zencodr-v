# Zencodr Setup Instructions

## Prerequisites
- Node.js installed.
- Supabase Project (Create one at supabase.com).

## 1. Configure Environment Variables
Rename `.env.local.example` to `.env.local` and add your Supabase credentials.
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Add the following tables in your Supabase SQL Editor:
```sql
create table rooms (
  id uuid default gen_random_uuid() primary key,
  room_id text unique not null,
  language text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table messages (
  id uuid default gen_random_uuid() primary key,
  room_id text references rooms(room_id),
  user_id text not null,
  username text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table signaling (
  id uuid default gen_random_uuid() primary key,
  room_id text references rooms(room_id),
  from_user text not null,
  to_user text,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: Enable Realtime for 'messages' and 'signaling' tables in Supabase Dashboard > Database > Replication.
```

## 2. Install Dependencies
Run:
```bash
npm install
```

## 3. Run the Application
You need to run **two** processes (or use `concurrently` if you install it).

**Terminal 1 (Websocket Server for Collab):**
```bash
node server.js
```

**Terminal 2 (Next.js App):**
```bash
npm run dev
```

## 4. Usage
1. Open http://localhost:3000
2. Click **Create Room**.
3. Copy the URL and open in a second browser window (incognito or different profile) to simulate a second user.
4. **Upload a Folder** in one window.
5. See files appear in the second window.
6. Edit code and see changes in real-time.
7. Use the Chat tab to send messages.
8. Use the Microphone button to test Voice (requires permission).
