# WebSocket Setup Guide for Zencodr

## Current Issue
The `@google/generative-ai` module error will be resolved by restarting the dev server.

## WebSocket Server Setup (Required for Real-time Collaboration)

### What is the WebSocket Server?
The WebSocket server (`server.js`) enables real-time collaboration features:
- **Live code editing** - See changes from other users instantly
- **File synchronization** - Files appear in all connected clients
- **Cursor positions** - See where other users are typing
- **Terminal sharing** - Shared terminal state

### How to Run WebSocket Server

You need **TWO terminals** running simultaneously:

#### Terminal 1: WebSocket Server
```bash
node server.js
```
This starts the Yjs WebSocket server on `ws://localhost:1234`

#### Terminal 2: Next.js App
```bash
npm run dev
```
This starts the web app on `http://localhost:3000`

### Current Configuration

The app is configured to connect to:
- **WebSocket URL**: `ws://localhost:1234` (default)
- **Can be changed**: Set `NEXT_PUBLIC_WS_URL` in `.env.local`

### Checking WebSocket Connection

1. Open browser DevTools → Console
2. Look for connection status messages
3. The "Offline" indicator in File Explorer shows if WebSocket is disconnected

### Alternative: Using a Public WebSocket Server

If you don't want to run `server.js` locally, you can use a hosted Yjs server:

1. Deploy `server.js` to a service like Railway, Render, or Fly.io
2. Update `.env.local`:
```env
NEXT_PUBLIC_WS_URL=wss://your-deployed-server.com
```

### Quick Start Commands

**Option 1: Two Terminals**
```bash
# Terminal 1
node server.js

# Terminal 2  
npm run dev
```

**Option 2: Using Concurrently (Install first)**
```bash
npm install -D concurrently
```

Then add to `package.json`:
```json
"scripts": {
  "dev:all": "concurrently \"node server.js\" \"next dev\""
}
```

Run with:
```bash
npm run dev:all
```

## Troubleshooting

### "Module not found: @google/generative-ai"
**Solution**: Restart the dev server (Ctrl+C, then `npm run dev`)

### "WebSocket connection failed"
**Solution**: Make sure `node server.js` is running in another terminal

### "Cannot connect to ws://localhost:1234"
**Solution**: 
1. Check if port 1234 is available
2. Verify `server.js` is running without errors
3. Check firewall settings

## Testing Real-time Features

1. Start both servers (WebSocket + Next.js)
2. Open `http://localhost:3000` in two browser windows
3. Create a room in one window
4. Copy the room URL to the second window
5. Upload files in one window → Should appear in both
6. Type in the editor → Should sync in real-time
