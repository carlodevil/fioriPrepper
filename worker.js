import { Hono } from 'hono';
import { serveStatic as serveStaticNode } from '@hono/node-server/serve-static';
import { serveStatic as serveStaticWorker } from 'hono/cloudflare-workers';
import questions from './data/questions.json' with { type: 'json' };

const BANK_SIZE = 40;
const bankCount = Math.ceil(questions.length / BANK_SIZE);

function getBank(ids){
  return ids.flatMap(b => questions.slice((b - 1) * BANK_SIZE, b * BANK_SIZE));
}

const app = new Hono();

app.get('/api/banks', c => c.json({ bankCount, bankSize: BANK_SIZE }));

app.get('/api/bank/:ids', c => {
  const ids = c.req.param('ids').split(',').map(Number).filter(Boolean);
  if (!ids.length || ids.some(i => i < 1 || i > bankCount))
    return c.text('Invalid bank id', 400);
  return c.json(getBank(ids));
});

// serve static assets
const isNode = typeof process !== 'undefined' && process.versions?.node;
const staticMiddleware = isNode
  ? serveStaticNode({ root: './public' })
  : serveStaticWorker({ root: './' });

app.use('*', staticMiddleware);

export default app;
