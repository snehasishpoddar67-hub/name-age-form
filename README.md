# Name & Age form

A tiny site: a visitor types their name and age, and it's saved to a Neon Postgres database. You read the entries through a private link.

Stack: static HTML + Cloudflare Worker + Neon (Postgres), code kept on GitHub.

## Files
- `public/index.html` – the form (move `index.html` into a `public/` folder)
- `worker.js` – API: `POST /api/submit`, `GET /api/entries?key=...`
- `schema.sql` – creates the `submissions` table
- `wrangler.toml`, `package.json` – Cloudflare config

## Setup
1. **Neon**: create a project, open the SQL editor, run `schema.sql`, copy the connection string.
2. **GitHub**: create a repo and push these files.
3. **Cloudflare**: `npm install`, then
   - `npx wrangler secret put DATABASE_URL` (paste the Neon connection string)
   - `npx wrangler secret put ADMIN_KEY` (choose a long random password)
   - `npm run deploy`
   (Or connect the GitHub repo in Cloudflare Workers & Pages for auto-deploys, and add the two secrets there.)

## See the information
Open `https://<your-worker>.workers.dev/api/entries?key=YOUR_ADMIN_KEY`
