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

const VOWELS = [
  { display: 'בֲ',  name: 'ハテフ・パタハ',          sounds: ['a'],      romanized: 'ă'   },
  { display: 'בֱ',  name: 'ハテフ・セゴル',          sounds: ['e'],      romanized: 'ĕ'   },
  { display: 'בֳ',  name: 'ハテフ・カメツ',          sounds: ['o'],      romanized: 'ŏ'   },
  { display: 'בְ',  name: '有音 / 無音シェワ',  sounds: ['e', '無音'], romanized: 'ə / –' },
  { display: 'בַ',  name: 'パタハ',                  sounds: ['a'],      romanized: 'a'   },
  { display: 'בִ',  name: 'ヒレク',                  sounds: ['i'],      romanized: 'i'   },
  { display: 'בֻ',  name: 'キブツ',                  sounds: ['u'],      romanized: 'u'   },
  { display: 'בֶ',  name: 'セゴル',                  sounds: ['e'],      romanized: 'e'   },
  { display: 'בָ',  name: '大カメツ / 小カメツ',      sounds: ['a', 'o'], romanized: 'ā/o' },
  { display: 'בֵ',  name: 'ツェレ',                  sounds: ['e'],      romanized: 'ē'   },
  { display: 'בֹ',  name: 'ホレム',                  sounds: ['o'],      romanized: 'ō'   },
  { display: 'בָה', name: '大カメツ・ヘー',           sounds: ['a'],      romanized: 'â'   },
  { display: 'בִי', name: 'ヒレク・ヨード',           sounds: ['i'],      romanized: 'î'   },
  { display: 'בוּ', name: 'シュルク',                sounds: ['u'],      romanized: 'û'   },
  { display: 'בֵי', name: 'ツェレ・ヨード',           sounds: ['e'],      romanized: 'ê'   },
  { display: 'בוֹ', name: 'ホレム・ワウ',             sounds: ['o'],      romanized: 'ô'   },
];

const VOWEL_SOUNDS = ['a', 'i', 'u', 'e', 'o', '無音'];

const FONTS = [
  { value: 'Cardo',            style: 'セリフ',     previewSize: '1.2rem' },
  { value: 'Frank Ruhl Libre', style: 'セリフ',     previewSize: '1.45rem' },
  { value: 'Heebo',            style: 'サンセリフ', previewSize: '1.2rem' },
  { value: 'Assistant',        style: 'サンセリフ', previewSize: '1.4rem' },
];

const STORAGE_KEY_FONT = 'hebrew-quiz-font';
const STORAGE_KEY_MODE = 'hebrew-quiz-mode';
const STORAGE_KEY_TYPE = 'hebrew-quiz-type';
const PREVIEW_CHAR = 'שׁלום'; // preview word shown on start screen (שׁ = shin with shin dot)

// --- State ---
let shuffledOrder = [];
let currentIndex  = 0;
let correctCount   = 0;
let incorrectCount = 0;
let answered       = false;
let selectedFont    = localStorage.getItem(STORAGE_KEY_FONT) || 'Cardo';
let selectedMode    = localStorage.getItem(STORAGE_KEY_MODE) || 'random';
let quizType        = localStorage.getItem(STORAGE_KEY_TYPE) || 'consonant';
let selectedAnswers = [];

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
const quizHomeBtn  = document.getElementById('quiz-home-btn');

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

function pickWrongVowelNames(correctIdx, count) {
  const pool = VOWELS.filter((_, i) => i !== correctIdx);
  return shuffle(pool).slice(0, count);
}

function isVowelType() {
  return quizType === 'vowel' || quizType === 'vowel-name';
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

    top.appendChild(nameSpan);

    info.appendChild(top);

    const preview = document.createElement('span');
    preview.className = 'font-option-preview';
    preview.style.fontFamily = `'${font.value}', serif`;
    preview.style.fontSize   = font.previewSize;
    preview.textContent = PREVIEW_CHAR;

    label.appendChild(radio);
    label.appendChild(preview);
    label.appendChild(info);

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
  const data    = isVowelType() ? VOWELS : LETTERS;
  const indices = data.map((_, i) => i);
  shuffledOrder = selectedMode === 'alpha' ? indices : shuffle(indices);
  currentIndex   = 0;
  correctCount   = 0;
  incorrectCount = 0;
  answered       = false;

  applyFont(selectedFont);
  showQuizScreen();
  startTimer();
  showQuestion();

  gtag('event', 'quiz_start', {
    quiz_type: quizType,
    mode:      selectedMode,
    font:      selectedFont,
  });
}

function showQuestion() {
  nextWrap.classList.add('hidden');

  const choicesEl = document.getElementById('choices');
  choicesEl.style.display = 'none';
  choicesEl.offsetHeight; // force reflow
  choicesEl.style.display = '';

  selectedAnswers = [];

  choiceBtns.forEach(btn => {
    btn.classList.remove('correct', 'wrong', 'hidden');
    btn.disabled = false;
    btn.textContent = '';
  });

  const data      = isVowelType() ? VOWELS : LETTERS;
  const letterIdx = shuffledOrder[currentIndex];
  const correct   = data[letterIdx];

  updateProgressDisplay();

  letterEl.style.color = '';

  if (quizType === 'vowel') {
    choicesEl.classList.add('vowel-mode');
    letterEl.textContent = correct.display;
    choiceBtns.forEach((btn, i) => {
      btn.textContent     = VOWEL_SOUNDS[i];
      btn.dataset.correct = correct.sounds.includes(VOWEL_SOUNDS[i]) ? 'true' : 'false';
    });
  } else if (quizType === 'vowel-name') {
    choicesEl.classList.remove('vowel-mode');
    letterEl.textContent = correct.display;
    choiceBtns[4].classList.add('hidden');
    choiceBtns[4].dataset.correct = 'false';
    choiceBtns[5].classList.add('hidden');
    choiceBtns[5].dataset.correct = 'false';

    const wrongs  = pickWrongVowelNames(letterIdx, 3);
    const choices = shuffle([correct, ...wrongs]);
    choiceBtns.forEach((btn, i) => {
      if (i >= 4) return;
      btn.textContent     = choices[i].name;
      btn.dataset.correct = (choices[i] === correct) ? 'true' : 'false';
    });
  } else {
    choicesEl.classList.remove('vowel-mode');
    letterEl.textContent = correct.char;
    choiceBtns[4].classList.add('hidden');
    choiceBtns[4].dataset.correct = 'false';
    choiceBtns[5].classList.add('hidden');
    choiceBtns[5].dataset.correct = 'false';

    const wrongs  = pickWrongAnswers(letterIdx, 3);
    const choices = shuffle([correct, ...wrongs]);
    choiceBtns.forEach((btn, i) => {
      if (i >= 4) return;
      btn.textContent     = choices[i].name;
      btn.dataset.correct = (choices[i] === correct) ? 'true' : 'false';
    });
  }

  answered = false;
}

function handleAnswer(btn) {
  if (answered) return;

  const isMulti = quizType === 'vowel' &&
    VOWELS[shuffledOrder[currentIndex]].sounds.length > 1;

  if (isMulti) {
    if (btn.dataset.correct === 'false') {
      // 不正解：即時終了
      answered = true;
      btn.classList.add('wrong');
      incorrectCount++;
      choiceBtns.forEach(b => {
        if (b.dataset.correct === 'true') b.classList.add('correct');
        b.disabled = true;
      });
      updateProgressDisplay();
      nextWrap.classList.remove('hidden');
    } else {
      // 正解の1つを選択
      btn.classList.add('correct');
      btn.disabled = true;
      selectedAnswers.push(btn.textContent);
      if (selectedAnswers.length >= VOWELS[shuffledOrder[currentIndex]].sounds.length) {
        // 全正解選択完了
        answered = true;
        correctCount++;
        letterEl.style.color = '#17B890';
        choiceBtns.forEach(b => { b.disabled = true; });
        updateProgressDisplay();
        setTimeout(nextQuestion, 200);
      }
    }
    return;
  }

  // 単一正解（子音クイズ・単音母音）
  answered = true;
  const isCorrect = btn.dataset.correct === 'true';

  if (isCorrect) {
    correctCount++;
    letterEl.style.color = '#17B890';
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
    setTimeout(nextQuestion, 200);
  } else {
    nextWrap.classList.remove('hidden');
  }
}

function nextQuestion() {
  const data = isVowelType() ? VOWELS : LETTERS;
  currentIndex++;
  if (currentIndex >= data.length) {
    finishQuiz();
  } else {
    showQuestion();
  }
}

function updateProgressDisplay() {
  const data        = isVowelType() ? VOWELS : LETTERS;
  const questionNum = currentIndex + 1;
  const total       = data.length;
  progressBar.style.width = `${((questionNum - 1) / total) * 100}%`;
  progressText.innerHTML =
    `${questionNum} / ${total}問` +
    `　<span class="progress-correct">○ ${correctCount}</span>` +
    `　<span class="progress-wrong">✕ ${incorrectCount}</span>`;
}

function finishQuiz() {
  stopTimer();
  showResultScreen();

  const data     = isVowelType() ? VOWELS : LETTERS;
  const total    = data.length;
  const accuracy = Math.round((correctCount / total) * 100);

  resultScore.innerHTML = `${accuracy}<span class="result-unit">%</span>`;
  resultTime.textContent  = formatTime(elapsedSeconds);
  document.getElementById('result-detail').innerHTML =
    `<span class="progress-correct">○ ${correctCount}</span>　<span class="progress-wrong">✕ ${incorrectCount}</span>`;

  let msg;
  if (accuracy === 100)    msg = '全問正解！ヘブライ文字を完全制覇しました。';
  else if (accuracy >= 90) msg = '惜しい！あと一歩で完全制覇です。';
  else if (accuracy >= 75) msg = '基礎はしっかり身についています。繰り返して完璧を目指しましょう。';
  else if (accuracy >= 50) msg = '着実に覚えてきています。続けることが大切です。';
  else                     msg = '焦らず少しずつ。何度も繰り返すうちに必ず定着します。';

  resultMsg.textContent = msg;

  gtag('event', 'quiz_complete', {
    quiz_type:       quizType,
    accuracy:        accuracy,
    correct:         correctCount,
    incorrect:       incorrectCount,
    elapsed_seconds: elapsedSeconds,
    mode:            selectedMode,
    font:            selectedFont,
  });
}

// --- Share ---
const APP_URL = 'https://alefbet.jp';

function shareToLine() {
  gtag('event', 'share_click', {
    platform:  'line',
    quiz_type: quizType,
  });
  const text = `ヘブライ語Alefbet道場\n旧約聖書を原典で読むための第一歩\n${APP_URL}`;
  const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function shareToX() {
  const data     = isVowelType() ? VOWELS : LETTERS;
  const accuracy = Math.round((correctCount / data.length) * 100);
  gtag('event', 'share_click', {
    platform:  'x',
    quiz_type: quizType,
    accuracy:  accuracy,
  });
  const quizLabel = quizType === 'vowel' ? '母音記号（音）16問'
                  : quizType === 'vowel-name' ? '母音記号（名前）16問'
                  : 'ヘブライ文字28問';
  const text = [
    `🏆 ヘブライ語Alefbet道場 ${quizLabel}に挑戦！`,
    `正答率：${accuracy}%　タイム：${formatTime(elapsedSeconds)}`,
    `#Alefbet道場 ${APP_URL}`,
  ].join('\n');

  const url = new URL('https://twitter.com/intent/tweet');
  url.searchParams.set('text', text);
  window.open(url.toString(), '_blank', 'noopener,noreferrer');
}

// --- Event listeners ---
function updateModeLabels() {
  const nameEl = document.querySelector('#mode-label-alpha .mode-option-name');
  nameEl.innerHTML = isVowelType() ? '固定順' : 'Alefbet順';
}

const typeRadios = document.querySelectorAll('input[name="quizType"]');
typeRadios.forEach(radio => {
  if (radio.value === quizType) radio.checked = true;
  radio.addEventListener('change', () => {
    quizType = radio.value;
    localStorage.setItem(STORAGE_KEY_TYPE, quizType);
    updateModeLabels();
  });
});

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
  const correctBtn = [...choiceBtns].find(b => b.dataset.correct === 'true' && !b.disabled);
  if (correctBtn) handleAnswer(correctBtn);
});

startBtn.addEventListener('click', startQuiz);

document.getElementById('quiz-home-btn').addEventListener('click', () => {
  stopTimer();
  buildFontOptions();
  showStartScreen();
});

document.getElementById('line-btn').addEventListener('click', shareToLine);
shareBtn.addEventListener('click', shareToX);
retryBtn.addEventListener('click', () => {
  const data = isVowelType() ? VOWELS : LETTERS;
  gtag('event', 'retry', {
    quiz_type:          quizType,
    previous_accuracy:  Math.round((correctCount / data.length) * 100),
  });
  startQuiz();
});

document.querySelector('.book-title-link').addEventListener('click', () => {
  gtag('event', 'book_click', {
    location:  'result_screen',
    quiz_type: quizType,
  });
});

homeBtn.addEventListener('click', () => {
  buildFontOptions();
  updateModeLabels();
  showStartScreen();
});

// --- Init ---
buildFontOptions();
updateModeLabels();
showStartScreen();
