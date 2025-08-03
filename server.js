import app from './worker.js';
import { serve } from '@hono/node-server';

const PORT = process.env.PORT || 3000;
serve({ fetch: app.fetch, port: PORT });
console.log(`✅  Quiz app listening on http://localhost:${PORT}`);
