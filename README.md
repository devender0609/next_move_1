# NextMove (MVP)

A fast-to-launch micro-decision assistant built with Next.js (App Router), Tailwind, and Supabase.

## 1) Setup
1. Create a Supabase project
2. Copy `.env.example` to `.env.local` and fill keys
3. Run the SQL in `supabase/schema.sql`
4. Install deps and start:
```bash
npm install
npm run dev
```

## 2) Deploy (Vercel)
- Import the repo in Vercel
- Add the env vars from `.env.local`
- In Supabase Auth:
  - Set Site URL to your Vercel URL
  - Add Redirect URL: `https://YOURDOMAIN.vercel.app/app/login`

## Notes
- The decision correctness uses the rule engine. If you set `OPENAI_API_KEY`, the app will *rewrite* explanations but will not change the chosen task.
