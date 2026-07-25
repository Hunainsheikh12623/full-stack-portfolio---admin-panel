# Portfolio admin with Supabase

The React app uses the existing Express API. The API stores portfolio content in Supabase Postgres, uses Supabase Auth for admin login, and uploads media to Supabase Storage.

## Setup

1. Create a Supabase project, copy `.env.example` to `.env.local`, and fill in the values from **Project Settings → API**, plus your `ADMIN_EMAIL`. The secret/service-role key must remain server-only.
2. Run [supabase/migrations/20260725_portfolio.sql](supabase/migrations/20260725_portfolio.sql) in the Supabase SQL Editor.
3. Import the repository's sample portfolio data: `npm run db:seed`.
4. In **Authentication → Users**, create the user whose email is `ADMIN_EMAIL` with a password (or invite one).
5. Start the app with `npm run dev`, then sign in at `/admin` using that Supabase user.

The migration enables RLS and blocks browser access to portfolio data. Public pages remain public through the Express API; only the server holds the Supabase secret key.

## Deploy on Vercel

1. Push the project to GitHub and import it as a Vercel project.
2. Set the framework preset to **Vite**, the build command to `npm run build`, and the output directory to `dist`.
3. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, and `NODE_ENV=production` to both the Production and Preview environments.
4. Deploy. The Vercel function at `api/index.ts` serves the Express API and `vercel.json` routes `/api/*` requests to it while preserving SPA navigation.
5. Set Supabase Authentication → URL Configuration → Site URL to the deployed Vercel URL.
# full-stack-portfolio---admin-panel
