# Deployment Guide for Zencodr

This guide covers how to deploy the Zencodr application for a production environment, ensuring both the frontend and the real-time collaboration features work correctly.

## Architecture Overview

Zencodr consists of two parts that need to be deployed:
1.  **Frontend (Next.js)**: The main website, dashboard, and UI.
2.  **Signaling Server (Node.js)**: A lightweight WebSocket server (`server.js`) that brokers connections between users for real-time coding and voice chat.

---

## Part 1: Deploying the Signaling Server (Backend)

The signaling server must be deployed to a service that supports **persistent WebSocket connections**. Good options include **Render** or **Railway**. **Netlify/Vercel do NOT support this for long-running processes.**

### Option A: Deploy on Render (Recommended & Free Tier)

1.  Create a new repository on GitHub strictly for the `server.js` if possible, OR use your existing repo and configure the build command carefully.
2.  **Ideally**, create a separate folder or repo with just `package.json` and `server.js`.
    *   `package.json` should have `"start": "node server.js"` and dependencies: `"ws": "^8.x", "y-websocket": "^1.x"`.
3.  Go to [Render.com](https://render.com/) and create a **New Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Runtime**: Node
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
6.  Deploy. Render will give you a URL like `https://zencodr-signaling.onrender.com`.
7.  **Note the URL**. You will need this for Part 2. *Note: The URL might be `wss://...` when used in the code, but Render provides `https://...`.*

---

## Part 2: Deploying the Frontend (Netlify)

1.  Push your latest code to GitHub.
2.  Log in to [Netlify](https://www.netlify.com/).
3.  **Add New Site** -> **Import an existing project**.
4.  Select your Zencodr repository.
5.  **Build Settings**:
    *   **Base directory**: (leave empty)
    *   **Build command**: `npm run build`
    *   **Publish directory**: `.next`
6.  **Environment Variables**:
    You MUST set these in **Site settings > Environment variables** for the app to work:
    
    | Variable Key | Value Description |
    | :--- | :--- |
    | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
    | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon/Public Key |
    | `NEXT_PUBLIC_WS_URL` | **The URL from Part 1**. Replace `https://` with `wss://`. <br> Example: `wss://zencodr-signaling.onrender.com` |

7.  **Deploy Site**.

---

## Verification

1.  Visit your live Netlify URL (e.g., `https://zencodr.netlify.app`).
2.  Login and go to the **Dashboard**.
3.  Create a Room.
4.  Open the room link in a **different browser** or **Incognito window**.
5.  If you see the other user's cursor and typing in real-time, **CONGRATULATIONS!** You are fully live.

## Troubleshooting

-   **"WebSocket connection failed"**: Check your `NEXT_PUBLIC_WS_URL`. It must start with `wss://` (Secure WebSocket) if your site is `https://`.
-   **Build Fails**: Check the Netlify deploy logs. If it's a lint error, ensuring `npm run lint` passes locally usually fixes it.
