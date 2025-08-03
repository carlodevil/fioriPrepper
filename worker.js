import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static';
import questions from './data/questions.json' with { type: 'json' };

const BANK_SIZE = 40;
const bankCount = Math.ceil(questions.length / BANK_SIZE);

function getBank(ids){
  return ids.flatMap(b => questions.slice((b - 1) * BANK_SIZE, b * BANK_SIZE));
}

// in-memory fallback for leaderboard when KV isn't available
const memory = {};

const app = new Hono();

app.get('/api/banks', c => c.json({ bankCount, bankSize: BANK_SIZE }));

app.get('/api/bank/:ids', c => {
  const ids = c.req.param('ids').split(',').map(Number).filter(Boolean);
  if (!ids.length || ids.some(i => i < 1 || i > bankCount))
    return c.text('Invalid bank id', 400);
  return c.json(getBank(ids));
});

app.get('/api/leaderboard/:key', async c => {
  const key = c.req.param('key');
  const store = c.env?.LEADERBOARD;
  let list;
  if (store) {
    list = await store.get(key, { type: 'json' }) ?? [];
  } else {
    list = memory[key] ?? [];
  }
  list = list.sort((a,b)=> b.score - a.score || a.time - b.time).slice(0,10);
  return c.json(list);
});

app.post('/api/leaderboard/:key', async c => {
  const key = c.req.param('key');
  const { name, score, total, time } = await c.req.json();
  if (!name || typeof score !== 'number') return c.text('Bad Request',400);
  const store = c.env?.LEADERBOARD;
  let list;
  if (store) {
    list = await store.get(key, { type: 'json' }) ?? [];
  } else {
    list = memory[key] ?? [];
  }
  list.push({ name: name.trim().slice(0,20), score, total, time });
  list = list.sort((a,b)=> b.score - a.score || a.time - b.time).slice(0,10);
  if (store) {
    await store.put(key, JSON.stringify(list));
  } else {
    memory[key] = list;
  }
  return c.body(null, 201);
});

// serve static assets
app.use('*', serveStatic({ root: './public' }));

export default app;
