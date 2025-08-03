/* -------------------------------------------------- *
 *  Fiori Study Buddy – front-end (Bank mode + SR)    *
 * -------------------------------------------------- */

/* ---------- DOM shortcuts & helpers ------------ */
const $   = sel => document.querySelector(sel);
const API = p   => fetch(`/api/${p}`).then(r => r.json());
const shuffle = a => { for (let i=a.length;i;--i) { const j=Math.random()*i|0; [a[i-1],a[j]]=[a[j],a[i-1]]; } return a; };
const labelFor  = n => n === 1 ? 'One correct answer' : `${n} correct answers`;

/* ---------- runtime state ---------------------- */
let bankMeta   = { bankCount:0, bankSize:40 };
let selected   = [];                            // chosen banks (int array)
let questions  = [];
let queue      = [];
let idx        = 0;
let correct    = 0;
let incorrect  = 0;
let answered   = false;
let correctCnt = 0;
const REINSERT = 4;                             // spaced-repetition gap

/* ---------- boot ------------------------------ */
showHome();

/* =================================================
 *  HOME SCREEN
 * ================================================= */
async function showHome() {
  bankMeta = await API('banks');                // {bankCount, bankSize}

  app.innerHTML = `
    <div class="w-full max-w-lg mx-auto space-y-6">
      <h1 class="text-center text-2xl font-bold mb-2">Choose Bank(s)</h1>

      <form id="bankForm"
            class="space-y-2 border p-4 rounded-xl bg-slate-800 overflow-auto max-h-72">
        ${Array.from({length:bankMeta.bankCount},(_,i)=>`
          <label class="flex gap-2 items-center cursor-pointer">
            <input type="checkbox" value="${i+1}" class="accent-indigo-500">
            Bank ${i+1}
          </label>`).join('')}
      </form>

      <button id="startBtn"
              class="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700">
        ▶ Start
      </button>
    </div>`;

  $('#startBtn').onclick = prepareRun;
}

/* =================================================
 *  LOAD QUESTIONS & START QUIZ
 * ================================================= */
async function prepareRun() {
  selected = [...document.querySelectorAll('#bankForm input:checked')].map(i=>+i.value);

  if (!selected.length) {                       // no boxes ticked → all banks
    selected = Array.from({length:bankMeta.bankCount},(_,i)=>i+1);
  }

  const raw = await API('bank/' + selected.join(','));

  questions = shuffle(raw.map(q=>({
    questionText : q.question ?? q.questionText ?? '',
    image        : q.image ?? null,
    answers      : q.answers
  })));

  queue   = [...questions];
  idx = correct = incorrect = 0;
  renderQuestion();
}

/* =================================================
 *  RENDER ONE QUESTION
 * ================================================= */
function renderQuestion() {
  answered = false;
  if (idx >= queue.length) return showResult();

  const q   = queue[idx];
  const ans = shuffle([...q.answers]);
  correctCnt = ans.filter(a=>a.correct).length;
  const multi = correctCnt > 1;

  app.innerHTML = `
    <div class="w-full max-w-3xl mx-auto space-y-6">
      <div class="flex justify-between text-sm">
        <span>Correct: <strong>${correct}</strong></span>
        <span>Wrong: <strong>${incorrect}</strong></span>
      </div>

      <div class="bg-slate-800 p-6 rounded-xl shadow">
        ${q.questionText ? `<h2 class="text-lg font-semibold mb-4">${q.questionText}</h2>` : ''}

        <p class="mb-4 italic text-sm text-slate-400">${labelFor(correctCnt)}</p>

        ${q.image ? `<img class="mb-4 max-h-60 mx-auto" src="${q.image}" alt="">` : ''}

        <div id="answers" class="space-y-3"></div>

        ${multi ? `
          <button id="answerBtn"
                  class="mt-6 w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30"
                  disabled>Answer</button>` : ''}
      </div>

      <progress class="w-full h-3"
                value="${Math.min(idx,questions.length)}"
                max="${questions.length}"></progress>
    </div>`;

  const container = $('#answers');
  ans.forEach((a,i)=>{
    const b = document.createElement('button');
    b.className = 'w-full flex gap-3 items-start p-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-left';
    b.dataset.correct = a.correct;
    b.innerHTML = `<span class="font-mono shrink-0">${i+1}.</span><span>${a.text}</span>`;
    b.onclick = () => select(b,multi);
    container.appendChild(b);
  });

  if (multi) $('#answerBtn').onclick = reveal;

  /* keyboard shortcuts (numbers + space) */
  window.onkeydown = e => {
    const n = parseInt(e.key,10);
    if (!isNaN(n)) $(`#answers button:nth-child(${n})`)?.click();
    if (answered && e.code === 'Space')
      document.querySelector('[data-role="next"]')?.click();
  };
}

/* =================================================
 *  SELECTION / REVEAL
 * ================================================= */
function select(btn,multi){
  if (answered) return;

  if (multi) {
    btn.classList.toggle('bg-slate-500');
    $('#answerBtn').disabled =
      ![...document.querySelectorAll('#answers button')].some(b=>
          b.classList.contains('bg-slate-500'));
  } else {
    btn.classList.add('bg-slate-500');
    reveal();
  }
}

function reveal(){
  answered = true;
  const buttons = [...document.querySelectorAll('#answers button')];
  let allCorrect = true;

  buttons.forEach(b=>{
    const chosen = b.classList.contains('bg-slate-500');
    const ok     = b.dataset.correct === 'true';
    if (ok) b.classList.add('correct');
    if (chosen && !ok){ b.classList.add('wrong'); allCorrect = false; }
  });

  showNext(allCorrect);
}

/* =================================================
 *  NEXT
 * ================================================= */
function showNext(ok){
  const area = $('.bg-slate-800');
  let next = $('#answerBtn');

  if (next) {
    /* morph “Answer” into “Next” */
    next.textContent = 'Next';
    next.disabled = false;
    next.classList.remove('bg-indigo-600','hover:bg-indigo-700');
    next.classList.add('bg-green-600','hover:bg-green-700');
    next.dataset.role = 'next';
  } else {
    /* single-answer path → create new Next button */
    next = document.createElement('button');
    next.textContent = 'Next';
    next.className = 'mt-6 w-full py-3 rounded-lg bg-green-600 hover:bg-green-700';
    next.dataset.role = 'next';
    area.appendChild(next);
  }
  next.onclick = () => advance(ok);
}

function advance(ok){
  ok ? ++correct : ++incorrect;
  if (!ok) queue.splice(Math.min(idx+REINSERT,queue.length),0,queue[idx]);
  ++idx;
  renderQuestion();
}

/* =================================================
 *  RESULT
 * ================================================= */
function showResult(){
  app.innerHTML = `
    <div class="w-full max-w-md mx-auto space-y-4 text-center">
      <h2 class="text-2xl font-bold">Quiz complete!</h2>
      <p class="text-lg">Score: ${correct} / ${questions.length}</p>

      <button id="homeBtn"
              class="w-full py-3 rounded-lg bg-slate-600 hover:bg-slate-700">
        ⬅ Home
      </button>
    </div>`;

  $('#homeBtn').onclick = showHome;
}

