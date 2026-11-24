import { neon } from '@neondatabase/serverless';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const sql = neon(env.DATABASE_URL);

    // Save a message
    if (url.pathname === '/api/submit' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400); }
      const username = String(body.username || '').trim().slice(0, 100);
      const message = String(body.message || '').trim().slice(0, 1000);
      if (!username) return json({ error: 'Please enter your username.' }, 400);
      if (!message) return json({ error: 'Please enter a message.' }, 400);
      await sql`INSERT INTO messages (username, message) VALUES (${username}, ${message})`;
      return json({ ok: true });
    }

    // View messages (owner only): /api/entries?key=YOUR_ADMIN_KEY
    if (url.pathname === '/api/entries' && request.method === 'GET') {
      if (!env.ADMIN_KEY || url.searchParams.get('key') !== env.ADMIN_KEY) return json({ error: 'Unauthorized' }, 401);
      const rows = await sql`SELECT id, username, message, created_at FROM messages ORDER BY created_at DESC LIMIT 500`;
      return json(rows);
    }

    // Everything else is served from /public by Cloudflare
    return env.ASSETS.fetch(request);
  },
};
