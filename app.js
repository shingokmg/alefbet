'use strict';

// アルファベット順（語末形は直後に配置、シン・スィンを分離）= 28文字
const LETTERS = [
  { char: 'א',  name: 'アレフ',               romanized: 'Alef' },
  { char: 'ב',  name: 'ベート',               romanized: 'Bet' },
  { char: 'ג',  name: 'ギメル',               romanized: 'Gimel' },
  { char: 'ד',  name: 'ダレト',               romanized: 'Dalet' },
  { char: 'ה',  name: 'ヘー',                 romanized: 'He' },
  { char: 'ו',  name: 'ワウ',                 romanized: 'Waw' },
  { char: 'ז',  name: 'ザイン',               romanized: 'Zayin' },
  { char: 'ח',  name: 'ヘート',               romanized: 'Het' },
  { char: 'ט',  name: 'テート',               romanized: 'Tet' },
  { char: 'י',  name: 'ヨード',               romanized: 'Yod' },
  { char: 'כ',  name: 'カフ',                 romanized: 'Kaf' },
  { char: 'ך',  name: 'カフ・ソフィット',     romanized: 'Kaf sofit' },
  { char: 'ל',  name: 'ラメド',               romanized: 'Lamed' },
  { char: 'מ',  name: 'メム',                 romanized: 'Mem' },
  { char: 'ם',  name: 'メム・ソフィット',     romanized: 'Mem sofit' },
  { char: 'נ',  name: 'ヌン',                 romanized: 'Nun' },
  { char: 'ן',  name: 'ヌン・ソフィット',     romanized: 'Nun sofit' },
  { char: 'ס',  name: 'サメフ',               romanized: 'Samekh' },
  { char: 'ע',  name: 'アイン',               romanized: 'Ayin' },
  { char: 'פ',  name: 'ペー',                 romanized: 'Pe' },
  { char: 'ף',  name: 'ペー・ソフィット',     romanized: 'Pe sofit' },
  { char: 'צ',  name: 'ツァデー',             romanized: 'Tsade' },
  { char: 'ץ',  name: 'ツァデー・ソフィット', romanized: 'Tsade sofit' },
  { char: 'ק',  name: 'コーフ',               romanized: 'Qof' },
  { char: 'ר',  name: 'レーシュ',             romanized: 'Resh' },
  { char: 'שׂ', name: 'スィン',               romanized: 'Sin' },
  { char: 'שׁ', name: 'シン',                 romanized: 'Shin' },
  { char: 'ת',  name: 'タウ',                 romanized: 'Tav' },
];

const FONTS = [
  { value: 'Cardo',            style: 'セリフ' },
  { value: 'Frank Ruhl Libre', style: 'セリフ' },
  { value: 'Heebo',            style: 'サンセリフ' },
  { value: 'Assistant',        style: 'サンセリフ' },
];

const STORAGE_KEY_FONT = 'hebrew-quiz-font';
const STORAGE_KEY_MODE = 'hebrew-quiz-mode';
const PREVIEW_CHAR = 'שׁלום'; // preview word shown on start screen (שׁ = shin with shin dot)

// --- State ---
let shuffledOrder = [];
let currentIndex  = 0;
let correctCount   = 0;
let incorrectCount = 0;
let answered       = false;
let selectedFont  = localStorage.getItem(STORAGE_KEY_FONT) || 'Cardo';
let selectedMode  = localStorage.getItem(STORAGE_KEY_MODE) || 'random';

// Timer state
let timerInterval = null;
let elapsedSeconds = 0;

// --- DOM refs ---
const startScreen  = document.getElementById('start-screen');
const quizScreen   = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const fontOptionsEl = document.getElementById('font-options');
const modeRadios    = document.querySelectorAll('input[name="mode"]');
const startBtn      = document.getElementById('start-btn');

const timerEl      = document.getElementById('timer');
const progressBar  = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const letterEl     = document.getElementById('letter-display');
const choiceBtns   = document.querySelectorAll('.choice-btn');
const nextWrap     = document.getElementById('next-wrap');
const nextBtn      = document.getElementById('next-btn');

const resultScore  = document.getElementById('result-score');
const resultTime   = document.getElementById('result-time');
const resultMsg    = document.getElementById('result-message');
const shareBtn     = document.getElementById('share-btn');
const retryBtn     = document.getElementById('retry-btn');
const homeBtn      = document.getElementById('home-btn');

// --- Helpers ---
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWrongAnswers(correctIdx, count) {
  const pool = LETTERS.filter((_, i) => i !== correctIdx);
  return shuffle(pool).slice(0, count);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// --- Font ---
function applyFont(fontName) {
  letterEl.style.fontFamily = `'${fontName}', serif`;
}

function buildFontOptions() {
  fontOptionsEl.innerHTML = '';
  FONTS.forEach(font => {
    const label = document.createElement('label');
    label.className = 'font-option' + (font.value === selectedFont ? ' selected' : '');

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'font';
    radio.value = font.value;
    radio.checked = font.value === selectedFont;

    const info = document.createElement('div');
    info.className = 'font-option-info';

    const top = document.createElement('div');
    top.className = 'font-option-top';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'font-option-name';
    nameSpan.textContent = font.value;

    const styleBadge = document.createElement('span');
    styleBadge.className = 'font-option-style font-style-' + font.style;
    styleBadge.textContent = font.style;

    top.appendChild(nameSpan);
    top.appendChild(styleBadge);

    info.appendChild(top);

    const preview = document.createElement('span');
    preview.className = 'font-option-preview';
    preview.style.fontFamily = `'${font.value}', serif`;
    preview.textContent = PREVIEW_CHAR;

    label.appendChild(radio);
    label.appendChild(info);
    label.appendChild(preview);

    radio.addEventListener('change', () => {
      selectedFont = font.value;
      localStorage.setItem(STORAGE_KEY_FONT, selectedFont);
      document.querySelectorAll('.font-option').forEach(el => el.classList.remove('selected'));
      label.classList.add('selected');
    });

    fontOptionsEl.appendChild(label);
  });
}

// --- Timer ---
function startTimer() {
  elapsedSeconds = 0;
  timerEl.textContent = formatTime(0);
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    timerEl.textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// --- Screens ---
function showStartScreen() {
  startScreen.classList.remove('hidden');
  quizScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
}

function showQuizScreen() {
  startScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  resultScreen.classList.add('hidden');
}

function showResultScreen() {
  startScreen.classList.add('hidden');
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
}

// --- Quiz logic ---
function startQuiz() {
  const indices = LETTERS.map((_, i) => i);
  shuffledOrder = selectedMode === 'alpha' ? indices : shuffle(indices);
  currentIndex   = 0;
  correctCount   = 0;
  incorrectCount = 0;
  answered       = false;

  applyFont(selectedFont);
  showQuizScreen();
  startTimer();
  showQuestion();
}

function showQuestion() {
  answered = false;
  nextWrap.classList.add('hidden');

  choiceBtns.forEach(btn => {
    btn.classList.remove('correct', 'wrong');
    btn.disabled = false;
    btn.textContent = '';
  });

  const letterIdx = shuffledOrder[currentIndex];
  const correct   = LETTERS[letterIdx];

  updateProgressDisplay();

  letterEl.textContent = correct.char;

  const wrongs  = pickWrongAnswers(letterIdx, 3);
  const choices = shuffle([correct, ...wrongs]);

  choiceBtns.forEach((btn, i) => {
    btn.textContent = choices[i].name;
    btn.dataset.correct = (choices[i] === correct) ? 'true' : 'false';
  });
}

function handleAnswer(btn) {
  if (answered) return;
  answered = true;

  const isCorrect = btn.dataset.correct === 'true';

  if (isCorrect) {
    btn.classList.add('correct');
    correctCount++;
  } else {
    btn.classList.add('wrong');
    incorrectCount++;
    choiceBtns.forEach(b => {
      if (b.dataset.correct === 'true') b.classList.add('correct');
    });
  }

  choiceBtns.forEach(b => { b.disabled = true; });
  updateProgressDisplay();

  if (isCorrect) {
    setTimeout(nextQuestion, 300);
  } else {
    nextWrap.classList.remove('hidden');
  }
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= LETTERS.length) {
    finishQuiz();
  } else {
    showQuestion();
  }
}

function updateProgressDisplay() {
  const questionNum = currentIndex + 1;
  const total       = LETTERS.length;
  progressBar.style.width = `${((questionNum - 1) / total) * 100}%`;
  progressText.innerHTML =
    `${questionNum} / ${total}問` +
    `　<span class="progress-correct">○ ${correctCount}</span>` +
    `　<span class="progress-wrong">✕ ${incorrectCount}</span>`;
}

function finishQuiz() {
  stopTimer();
  showResultScreen();

  const total = LETTERS.length;
  const pct   = Math.round((correctCount / total) * 100);

  resultScore.textContent = `${pct}`;
  resultTime.textContent  = formatTime(elapsedSeconds);
  document.getElementById('result-detail').innerHTML =
    `<span class="progress-correct">○ ${correctCount}</span>　<span class="progress-wrong">✕ ${incorrectCount}</span>`;

  let msg;
  if (pct === 100)    msg = '全問正解！ヘブライ文字を完全制覇しました。';
  else if (pct >= 90) msg = '惜しい！あと一歩で完全制覇です。';
  else if (pct >= 75) msg = '基礎はしっかり身についています。繰り返して完璧を目指しましょう。';
  else if (pct >= 50) msg = '着実に覚えてきています。続けることが大切です。';
  else                msg = '焦らず少しずつ。何度も繰り返すうちに必ず定着します。';

  resultMsg.textContent = msg;

}

// --- Share ---
const APP_URL = 'https://alefbet.jp';

function shareToLine() {
  const text = `ヘブライ語Alefbet道場\n旧約聖書を原典で読むための第一歩\n${APP_URL}`;
  const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function shareToX() {
  const total = LETTERS.length;
  const pct   = Math.round((correctCount / total) * 100);
  const text = [
    `🏆 ヘブライ語Alefbet道場 全28文字に挑戦！`,
    `スコア：${pct}点　タイム：${formatTime(elapsedSeconds)}`,
    `#Alefbet道場 ${APP_URL}`,
  ].join('\n');

  const url = new URL('https://twitter.com/intent/tweet');
  url.searchParams.set('text', text);
  window.open(url.toString(), '_blank', 'noopener,noreferrer');
}

// --- Event listeners ---
modeRadios.forEach(radio => {
  if (radio.value === selectedMode) radio.checked = true;
  radio.addEventListener('change', () => {
    selectedMode = radio.value;
    localStorage.setItem(STORAGE_KEY_MODE, selectedMode);
  });
});

choiceBtns.forEach(btn => {
  btn.addEventListener('click', () => handleAnswer(btn));
});

nextBtn.addEventListener('click', nextQuestion);

document.addEventListener('keydown', e => {
  if (e.key !== 'a') return;
  if (answered || quizScreen.classList.contains('hidden')) return;
  const correctBtn = [...choiceBtns].find(b => b.dataset.correct === 'true');
  if (correctBtn) handleAnswer(correctBtn);
});

startBtn.addEventListener('click', startQuiz);

document.getElementById('line-btn').addEventListener('click', shareToLine);
shareBtn.addEventListener('click', shareToX);
retryBtn.addEventListener('click', startQuiz);

homeBtn.addEventListener('click', () => {
  buildFontOptions();
  showStartScreen();
});

// --- Init ---
buildFontOptions();
showStartScreen();
