import { neon } from '@neondatabase/serverless';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const sql = neon(env.DATABASE_URL);

    // Save a submission
    if (url.pathname === '/api/submit' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400); }
      const name = String(body.name || '').trim().slice(0, 100);
const password = String(body.password || '');
if (!name) return json({ error: 'Please enter your name.' }, 400);
if (!password) return json({ error: 'Please enter your password.' }, 400);
      await sql`INSERT INTO submissions (name, age) VALUES (${name}, ${age})`;
return json({ ok: true });
    }

    // View submissions (owner only): /api/entries?key=YOUR_ADMIN_KEY
    if (url.pathname === '/api/entries' && request.method === 'GET') {
      if (!env.ADMIN_KEY || url.searchParams.get('key') !== env.ADMIN_KEY) return json({ error: 'Unauthorized' }, 401);
      const rows = await sql`SELECT id, name, age, created_at FROM submissions ORDER BY created_at DESC LIMIT 500`;
      return json(rows);
    }

    // Everything else is served from /public by Cloudflare
    return env.ASSETS.fetch(request);
  },
};
