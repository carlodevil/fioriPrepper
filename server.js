/* ------------------------------------------------------------------
   100 % working backend with static 40-question banks
   ------------------------------------------------------------------ */
import express from 'express';
import path    from 'path';
import fs      from 'fs/promises';            // ✅ promises API directly
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';

/* ---------- paths & constants ---------- */
const __dirname     = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_FILE = path.join(__dirname, 'data', 'questions.json');
const BANK_SIZE      = 40;                   // 40 cards per bank
const PORT           = process.env.PORT || 3000;

/* ---------- load questions & derive banks ---------- */
const rawQuestions = JSON.parse(await fs.readFile(QUESTIONS_FILE, 'utf8'));
const bankCount    = Math.ceil(rawQuestions.length / BANK_SIZE);

function getBank(ids) {
  // ids = array of 1-based integers, e.g. [1] or [2,3]
  return ids.flatMap(b =>
    rawQuestions.slice((b - 1) * BANK_SIZE, b * BANK_SIZE));
}

/* ---------- tiny JSON “DB” for leaderboards ---------- */
const db = new Low(
  new JSONFile(path.join(__dirname, 'data', 'leaderboard.json')),
  { scores: {} }                             // default structure
);
await db.read();

/* ---------- express setup ---------- */
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- routes ---------- */
// 1. meta info
app.get('/api/banks', (_req,res) =>
  res.json({ bankCount, bankSize: BANK_SIZE }));

// 2. questions for one or many banks
//    e.g. /api/bank/1  or  /api/bank/2,4,5
app.get('/api/bank/:ids', (req,res) => {
  const ids = req.params.ids.split(',').map(Number).filter(Boolean);
  if (!ids.length || ids.some(i => i < 1 || i > bankCount))
    return res.status(400).send('Invalid bank id');
  res.json(getBank(ids));
});

// 3. leaderboard (get top 10)
app.get('/api/leaderboard/:key', async (req,res) => {
  await db.read();
  const top = (db.data.scores[req.params.key] ?? [])
    .sort((a,b)=>b.score - a.score || a.time - b.time)
    .slice(0,10);
  res.json(top);
});

// 4. submit score
app.post('/api/leaderboard/:key', async (req,res) => {
  const { name, score, total, time } = req.body;
  if (!name || typeof score !== 'number') return res.status(400).end();
  await db.read();
  db.data.scores[req.params.key] ??= [];
  db.data.scores[req.params.key].push({
    name : name.trim().slice(0,20),
    score, total, time
  });
  await db.write();
  res.status(201).end();
});

/* ---------- start ---------- */
app.listen(PORT, () =>
  console.log(`✅  Quiz app listening on http://localhost:${PORT}`));
