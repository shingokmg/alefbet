'use strict';

const APP_URL = 'https://alefbet.jp';
const LANG = localStorage.getItem('alefbet-lang') === 'en' ? 'en' : 'ja';

const STRINGS = {
  ja: {
    retryWrong:       n => `${n}問 復習する`,
    retryAgain:       'もう一度',
    titlePerfect:     '🎉 完全制覇！',
    titleComplete:    'クイズ終了！',
    msg100:           '全問正解！完全制覇おめでとうございます。',
    msg90:            '惜しい！あと一歩で完全制覇です。',
    msg75:            '基礎はしっかり身についています。繰り返して完璧を目指しましょう。',
    msg50:            '着実に覚えてきています。続けることが大切です。',
    msg0:             '焦らず少しずつ。何度も繰り返すうちに必ず定着します。',
    progressUnit:     '問',
    modeAlpha:        'Alefbet順',
    modeAlphaVowel:   '固定順',
    lineText:         `ヘブライ語Alefbet道場\n旧約聖書を原典で読むための第一歩\n`,
    sharePrefix:      ['難読すぎる', '知る人ぞ知る', '3000年前の', '超難解'],
    shareLabelVowel:  '母音記号の正答率',
    shareLabelLetter: 'ヘブライ文字の正答率',
    shareChallenge:   'ヘブライ語に挑戦中✨',
    shareHashtag:     '#Alefbet道場',
    correctMark:      '○',
    wrongMark:        '✕',
  },
  en: {
    retryWrong:       n => `Review ${n} missed`,
    retryAgain:       'Try Again',
    titlePerfect:     '🎉 Perfect Score!',
    titleComplete:    'Quiz Complete!',
    msg100:           'Perfect score! Congratulations on mastering all the questions!',
    msg90:            'So close! One more step to a perfect score.',
    msg75:            'Good foundation! Keep practicing to reach perfection.',
    msg50:            'Steady progress! Consistency is the key.',
    msg0:             'Take it slow. Repetition is how it sticks.',
    progressUnit:     '',
    modeAlpha:        'In Order',
    modeAlphaVowel:   'In Order',
    lineText:         `Hebrew Alefbet Dojo\nYour first step to reading the OT in Hebrew\n`,
    sharePrefix:      ['Ancient script', 'Right-to-left', '3,000-year-old', 'Hardest alphabet'],
    shareLabelVowel:  'Vowel accuracy: ',
    shareLabelLetter: 'Hebrew letter accuracy: ',
    shareChallenge:   'Studying Hebrew✨',
    shareHashtag:     '#AlefbetDojo',
    correctMark:      '✓',
    wrongMark:        '✗',
  },
};
const S = STRINGS[LANG];

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
  { display: 'בֲ',  name: 'ハテフ・パタハ',          nameEn: 'Hateph Patah',          sounds: ['a'],        romanized: 'ă'   },
  { display: 'בֱ',  name: 'ハテフ・セゴル',          nameEn: 'Hateph Segol',          sounds: ['e'],        romanized: 'ĕ'   },
  { display: 'בֳ',  name: 'ハテフ・カメツ',          nameEn: 'Hateph Qamets',         sounds: ['o'],        romanized: 'ŏ'   },
  { display: 'בְ',  name: '有音 / 無音シェワ',   nameEn: 'Vocal / Silent Sheva',  sounds: ['ə', '無音'], romanized: 'ə / –' },
  { display: 'בַ',  name: 'パタハ',                  nameEn: 'Patah',                 sounds: ['a'],        romanized: 'a'   },
  { display: 'בִ',  name: 'ヒレク',                  nameEn: 'Hiriq',                 sounds: ['i'],        romanized: 'i'   },
  { display: 'בֻ',  name: 'キブツ',                  nameEn: 'Qibbuts',               sounds: ['u'],        romanized: 'u'   },
  { display: 'בֶ',  name: 'セゴル',                  nameEn: 'Segol',                 sounds: ['e'],        romanized: 'e'   },
  { display: 'בָ',  name: '大カメツ / 小カメツ',      nameEn: 'Qamets / Qamets Hatuf', sounds: ['a', 'o'],   romanized: 'ā/o' },
  { display: 'בֵ',  name: 'ツェレ',                  nameEn: 'Tsere',                 sounds: ['e'],        romanized: 'ē'   },
  { display: 'בֹ',  name: 'ホレム',                  nameEn: 'Holam',                 sounds: ['o'],        romanized: 'ō'   },
  { display: 'בָה', name: '大カメツ・ヘー',           nameEn: 'Qamets He',             sounds: ['a'],        romanized: 'â'   },
  { display: 'בִי', name: 'ヒレク・ヨード',           nameEn: 'Hiriq Yod',             sounds: ['i'],        romanized: 'î'   },
  { display: 'בוּ', name: 'シュルク',                nameEn: 'Shuruq',                sounds: ['u'],        romanized: 'û'   },
  { display: 'בֵי', name: 'ツェレ・ヨード',           nameEn: 'Tsere Yod',             sounds: ['e'],        romanized: 'ê'   },
  { display: 'בוֹ', name: 'ホレム・ワウ',             nameEn: 'Holam Waw',             sounds: ['o'],        romanized: 'ô'   },
];

const VOWEL_SOUNDS = ['a', 'i', 'u', 'e', 'o', 'ə', '無音'];
const VOWEL_SOUND_LABELS = LANG === 'en'
  ? ['a', 'i', 'u', 'e', 'o', 'ə', 'silent']
  : VOWEL_SOUNDS;

const FONTS = [
  { value: 'Cardo',            style: 'セリフ',     styleEn: 'Serif',      previewSize: '1.2rem'  },
  { value: 'Frank Ruhl Libre', style: 'セリフ',     styleEn: 'Serif',      previewSize: '1.45rem' },
  { value: 'Heebo',            style: 'サンセリフ', styleEn: 'Sans-Serif', previewSize: '1.2rem'  },
  { value: 'Assistant',        style: 'サンセリフ', styleEn: 'Sans-Serif', previewSize: '1.4rem'  },
];

const STORAGE_KEY_FONT = 'hebrew-quiz-font';
const STORAGE_KEY_MODE = 'hebrew-quiz-mode';
const STORAGE_KEY_TYPE = 'hebrew-quiz-type';
const PREVIEW_CHAR = 'שׁלום'; // preview word shown on start screen (שׁ = shin with shin dot)

// --- i18n helpers ---
function letterName(l) { return LANG === 'en' ? l.romanized : l.name; }
function vowelName(v)  { return LANG === 'en' ? v.nameEn    : v.name; }
function fontStyle(f)  { return LANG === 'en' ? f.styleEn   : f.style; }

// --- State ---
let shuffledOrder    = [];
let incorrectIndices = [];
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
const themeToggle  = document.getElementById('theme-toggle');

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

function resumeTimer() {
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
  currentIndex     = 0;
  correctCount     = 0;
  incorrectCount   = 0;
  incorrectIndices = [];
  answered         = false;

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

function startWrongOnlyQuiz() {
  shuffledOrder    = shuffle([...incorrectIndices]);
  currentIndex     = 0;
  correctCount     = 0;
  incorrectCount   = 0;
  incorrectIndices = [];
  answered         = false;

  applyFont(selectedFont);
  showQuizScreen();
  resumeTimer();
  showQuestion();
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
    btn.style.fontFamily = '';
  });

  const data      = isVowelType() ? VOWELS : LETTERS;
  const letterIdx = shuffledOrder[currentIndex];
  const correct   = data[letterIdx];

  updateProgressDisplay();

  letterEl.style.color = '';
  letterEl.classList.remove('reverse-name');
  choicesEl.classList.remove('vowel-mode', 'reverse-mode');

  if (quizType === 'vowel') {
    choicesEl.classList.add('vowel-mode');
    letterEl.textContent = correct.display;
    choiceBtns.forEach((btn, i) => {
      btn.textContent     = VOWEL_SOUND_LABELS[i];
      btn.dataset.correct = correct.sounds.includes(VOWEL_SOUNDS[i]) ? 'true' : 'false';
    });
  } else if (quizType === 'vowel-name') {
    letterEl.textContent = correct.display;
    choiceBtns[4].classList.add('hidden');
    choiceBtns[4].dataset.correct = 'false';
    choiceBtns[5].classList.add('hidden');
    choiceBtns[5].dataset.correct = 'false';
    choiceBtns[6].classList.add('hidden');
    choiceBtns[6].dataset.correct = 'false';

    const wrongs  = pickWrongVowelNames(letterIdx, 3);
    const choices = shuffle([correct, ...wrongs]);
    choiceBtns.forEach((btn, i) => {
      if (i >= 4) return;
      btn.textContent     = vowelName(choices[i]);
      btn.dataset.correct = (choices[i] === correct) ? 'true' : 'false';
    });
  } else if (quizType === 'consonant-reverse') {
    choicesEl.classList.add('reverse-mode');
    letterEl.classList.add('reverse-name');
    letterEl.style.fontFamily = '';
    letterEl.textContent = letterName(correct);
    choiceBtns[4].classList.add('hidden');
    choiceBtns[4].dataset.correct = 'false';
    choiceBtns[5].classList.add('hidden');
    choiceBtns[5].dataset.correct = 'false';
    choiceBtns[6].classList.add('hidden');
    choiceBtns[6].dataset.correct = 'false';

    const wrongs  = pickWrongAnswers(letterIdx, 3);
    const choices = shuffle([correct, ...wrongs]);
    choiceBtns.forEach((btn, i) => {
      if (i >= 4) return;
      btn.textContent      = choices[i].char;
      btn.dataset.correct  = (choices[i] === correct) ? 'true' : 'false';
      btn.style.fontFamily = `'${selectedFont}', serif`;
    });
  } else {
    letterEl.textContent = correct.char;
    choiceBtns[4].classList.add('hidden');
    choiceBtns[4].dataset.correct = 'false';
    choiceBtns[5].classList.add('hidden');
    choiceBtns[5].dataset.correct = 'false';
    choiceBtns[6].classList.add('hidden');
    choiceBtns[6].dataset.correct = 'false';

    const wrongs  = pickWrongAnswers(letterIdx, 3);
    const choices = shuffle([correct, ...wrongs]);
    choiceBtns.forEach((btn, i) => {
      if (i >= 4) return;
      btn.textContent     = letterName(choices[i]);
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
      incorrectIndices.push(shuffledOrder[currentIndex]);
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
    incorrectIndices.push(shuffledOrder[currentIndex]);
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
  currentIndex++;
  if (currentIndex >= shuffledOrder.length) {
    finishQuiz();
  } else {
    showQuestion();
  }
}

function updateProgressDisplay() {
  const questionNum = currentIndex + 1;
  const total       = shuffledOrder.length;
  progressBar.style.width = `${((questionNum - 1) / total) * 100}%`;
  progressText.innerHTML =
    `${questionNum} / ${total}${S.progressUnit}` +
    `　<span class="progress-correct">${S.correctMark} ${correctCount}</span>` +
    `　<span class="progress-wrong">${S.wrongMark} ${incorrectCount}</span>`;
}

function finishQuiz() {
  stopTimer();
  showResultScreen();

  const total    = shuffledOrder.length;
  const accuracy = Math.round((correctCount / total) * 100);

  retryBtn.textContent = incorrectCount > 0
    ? S.retryWrong(incorrectCount)
    : S.retryAgain;

  resultScore.innerHTML = `${accuracy}<span class="result-unit">%</span>`;
  resultTime.textContent  = formatTime(elapsedSeconds);
  document.getElementById('result-detail').innerHTML =
    `<span class="progress-correct">${S.correctMark} ${correctCount}</span>　<span class="progress-wrong">${S.wrongMark} ${incorrectCount}</span>`;

  const resultCard  = document.querySelector('.result-card');
  const resultTitle = document.querySelector('.result-title');

  let msg;
  if (accuracy === 100) {
    msg = S.msg100;
    resultTitle.textContent = S.titlePerfect;
    resultCard.classList.add('result-card--perfect');
    launchConfetti();
  } else {
    resultTitle.textContent = S.titleComplete;
    resultCard.classList.remove('result-card--perfect');
    if (accuracy >= 90)      msg = S.msg90;
    else if (accuracy >= 75) msg = S.msg75;
    else if (accuracy >= 50) msg = S.msg50;
    else                     msg = S.msg0;
  }

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

// --- Confetti ---
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#17B890', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#34d399'];
  const pieces = Array.from({ length: 120 }, () => ({
    x:    Math.random() * canvas.width,
    y:    Math.random() * -canvas.height,
    w:    6 + Math.random() * 8,
    h:    10 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rot:  Math.random() * Math.PI * 2,
    vx:   (Math.random() - 0.5) * 2,
    vy:   3 + Math.random() * 4,
    vr:   (Math.random() - 0.5) * 0.2,
  }));

  let frame;
  const DURATION = 7000;
  const start    = performance.now();

  function draw(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of pieces) {
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - elapsed / DURATION);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (elapsed < DURATION) {
      frame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  cancelAnimationFrame(frame);
  requestAnimationFrame(draw);
}

// --- Share ---
function shareToLine() {
  gtag('event', 'share_click', {
    platform:  'line',
    quiz_type: quizType,
  });
  const text = `${S.lineText}${APP_URL}`;
  const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function shareToWebShare() {
  const data     = isVowelType() ? VOWELS : LETTERS;
  const accuracy = Math.round((correctCount / data.length) * 100);
  gtag('event', 'share_click', {
    platform:  'web_share',
    quiz_type: quizType,
    accuracy:  accuracy,
  });
  navigator.share({
    title: 'Hebrew Alefbet Dojo',
    text:  `📜 Hebrew Alefbet quiz: ${accuracy}% correct in ${formatTime(elapsedSeconds)}\n#AlefbetDojo`,
    url:   `${APP_URL}/en/`,
  }).catch(() => {});
}

function shareToX() {
  const data     = isVowelType() ? VOWELS : LETTERS;
  const accuracy = Math.round((correctCount / data.length) * 100);
  gtag('event', 'share_click', {
    platform:  'x',
    quiz_type: quizType,
    accuracy:  accuracy,
  });
  const quizLabel = isVowelType() ? S.shareLabelVowel : S.shareLabelLetter;
  const shareUrl = LANG === 'en' ? `${APP_URL}/en/` : APP_URL;
  const text = LANG === 'en'
    ? `📜 Hebrew Alefbet quiz: ${accuracy}% correct in ${formatTime(elapsedSeconds)}\n${S.shareHashtag} ${shareUrl}`
    : [
        `${S.sharePrefix[Math.floor(Math.random() * S.sharePrefix.length)]}${S.shareChallenge}`,
        `${quizLabel}${accuracy}% / ${formatTime(elapsedSeconds)}`,
        `${S.shareHashtag} ${shareUrl}`,
      ].join('\n');

  const url = new URL('https://twitter.com/intent/tweet');
  url.searchParams.set('text', text);
  window.open(url.toString(), '_blank', 'noopener,noreferrer');
}

// --- Event listeners ---
function updateModeLabels() {
  const nameEl = document.querySelector('#mode-label-alpha .mode-option-name');
  nameEl.innerHTML = isVowelType() ? S.modeAlphaVowel : S.modeAlpha;
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
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest('a, button, input')) return;

  if (e.key === 'Enter') {
    // Start screen
    if (!startScreen.classList.contains('hidden')) {
      e.preventDefault();
      startBtn.click();
      return;
    }
    // Quiz screen: next question
    if (!quizScreen.classList.contains('hidden') && !nextWrap.classList.contains('hidden')) {
      e.preventDefault();
      nextQuestion();
      return;
    }
    // Result screen: retry
    if (!resultScreen.classList.contains('hidden')) {
      e.preventDefault();
      retryBtn.click();
      return;
    }
  }

  // Quiz screen only from here
  if (quizScreen.classList.contains('hidden')) return;

  // Cheat key
  if (e.key === 'x') {
    if (answered) return;
    const correctBtn = [...choiceBtns].find(b => b.dataset.correct === 'true' && !b.disabled);
    if (correctBtn) handleAnswer(correctBtn);
    return;
  }

  // Number keys: select choice
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 7) {
    const btn = choiceBtns[num - 1];
    if (btn && !btn.classList.contains('hidden') && !btn.disabled && !answered) {
      e.preventDefault();
      handleAnswer(btn);
    }
  }
});

startBtn.addEventListener('click', startQuiz);

document.getElementById('quiz-home-btn').addEventListener('click', () => {
  stopTimer();
  buildFontOptions();
  showStartScreen();
});

const lineBtnEl = document.getElementById('line-btn');
if (lineBtnEl) lineBtnEl.addEventListener('click', shareToLine);

const webShareBtn = document.getElementById('web-share-btn');
if (webShareBtn) {
  if (navigator.share) webShareBtn.classList.remove('hidden');
  webShareBtn.addEventListener('click', shareToWebShare);
}
shareBtn.addEventListener('click', shareToX);
retryBtn.addEventListener('click', () => {
  gtag('event', 'retry', {
    quiz_type:         quizType,
    previous_accuracy: Math.round((correctCount / shuffledOrder.length) * 100),
    wrong_only:        incorrectIndices.length > 0,
  });
  if (incorrectIndices.length > 0) {
    startWrongOnlyQuiz();
  } else {
    startQuiz();
  }
});


const bookTitleLink = document.querySelector('.book-title-link');
if (bookTitleLink) bookTitleLink.addEventListener('click', () => {
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

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('hebrew-quiz-theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('hebrew-quiz-theme', 'dark');
  }
});

document.querySelectorAll('[data-lang-link]').forEach(a => {
  a.addEventListener('click', () => {
    localStorage.setItem('alefbet-lang', a.dataset.langLink);
  });
});

// --- Init ---
buildFontOptions();
updateModeLabels();
showStartScreen();
