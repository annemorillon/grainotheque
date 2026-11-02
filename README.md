# Grainothèque

A small web app for listing seeds and submitting swap requests.

## Production

- **App:** [grainotheque-one.vercel.app](https://grainotheque-one.vercel.app/)
- **Frontend hosting:** Vercel
- **Database, Data API, and image storage:** Supabase

The frontend calls Supabase directly. There is no Express API in the active application flow.

## Features

- Browse seeds and filter the list by type and sowing season. Filtering happens in the browser.
- Add, edit, and delete seed listings.
- Upload seed photos to the public Supabase Storage bucket named `seeds-images`.
- Submit a swap request with a message. Requests are stored in the `requests` table; the app does not send email.

## Tech stack

- React and Vite
- Supabase Postgres and its REST Data API
- Supabase Storage
- Vercel

## Run locally

Requirements: Node.js and a Supabase project with the `seeds` and `requests` tables and a `seeds-images` Storage bucket.

1. Clone the repository and enter the frontend directory:

   ```bash
   git clone git@github.com:annemorillon/grainotheque.git
   cd grainotheque/frontend
   ```

2. Install the frontend dependencies:

   ```bash
   npm ci
   ```

3. In `frontend/`, create `.env.local` with your Supabase project URL and publishable key. The existing variable name contains `ANON`, but its value can be the current publishable key:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-publishable-key
   ```

   The publishable key is intended for browser use. Never put a Supabase secret or service-role key in a `VITE_` variable.

4. Start the development server:

   ```bash
   npm run dev
   ```

Vite prints the local URL, usually `http://localhost:5173`.

## Supabase access

The frontend uses the Supabase Data API and Storage API with the publishable key. Configure table grants and Row Level Security policies for the operations the app needs. Since the current app has no user accounts, policies that allow anonymous writes also allow visitors to change the public seed catalog and submit requests.

The Storage bucket must be named `seeds-images`. Seed photos are public so the app can display their URLs. Set its file size limit to at least the frontend limit of 5,000 KiB.