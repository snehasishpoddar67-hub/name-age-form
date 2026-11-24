# Guestbook

A tiny site: friends type their username and a short message, and it's saved to a Neon Postgres database. You read the messages through a private link.

Stack: static HTML + Cloudflare Worker + Neon (Postgres), code kept on GitHub.

## Files
- `public/index.html` – the form (username + message)
- `worker.js` – API: `POST /api/submit`, `GET /api/entries?key=...`
- `schema.sql` – creates the `messages` table
- `wrangler.toml`, `package.json` – Cloudflare config

## Setup
1. **Neon**: create a project, open the SQL editor, run `schema.sql`, copy the connection string.
2. **GitHub**: push these files to a repo.
3. **Cloudflare**: connect the repo under Workers & Pages, then add two secrets under Settings → Variables & Secrets:
   - `DATABASE_URL` – the Neon connection string
   - `ADMIN_KEY` – a long password you choose

## Read the messages
Open `https://<your-worker>.workers.dev/api/entries?key=YOUR_ADMIN_KEY`
