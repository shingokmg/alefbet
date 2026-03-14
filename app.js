'use strict';

const APP_URL = 'https://alefbet.jp';
const LANG = localStorage.getItem('alefbet-lang') === 'en' ? 'en' : 'ja';

const CHALLENGE_DURATION = 30;

const CHALLENGE_TIERS = [
  { min: 25, emoji: '👑', ja: '特級',  en: 'Master', msgJa: '極めて高いレベルの反射神経です！ もう文字を読むことで思考が止まることはないはずです。', msgEn: 'Incredible speed! Reading Hebrew now feels second nature.' },
  { min: 20, emoji: '🥇', ja: '1級',   en: 'Tier 1', msgJa: '素晴らしい集中力と正確性です。ヘブライ語学習の確固たる土台が完成しました！', msgEn: 'Outstanding focus and accuracy. You\'ve built a rock-solid foundation in Hebrew.' },
  { min: 15, emoji: '🥈', ja: '2級',   en: 'Tier 2', msgJa: '見事です！ スムーズに読めるようになり、日々の修練の成果がはっきりと現れています。', msgEn: 'Impressive! You\'re reading smoothly — your daily practice is clearly paying off.' },
  { min: 10, emoji: '🥉', ja: '3級',   en: 'Tier 3', msgJa: '素晴らしい！ 文字と音がしっかりと結びついてきましたね。', msgEn: 'Great progress! The more you repeat, the faster you\'ll get.' },
  { min:  5, emoji: '👏', ja: '4級',   en: 'Tier 4', msgJa: '文字と音が繋がり始めましたね！ この調子で反復すれば、さらにスピードアップできます。', msgEn: 'Letters and sounds are starting to click. Keep going — you\'ll pick up speed.' },
  { min:  0, emoji: '👍', ja: '5級',   en: 'Tier 5', msgJa: 'ナイスチャレンジ！ ヘブライ文字は最初は誰でも戸惑うものです。焦らずいきましょう。', msgEn: 'Nice try! Hebrew letters take time to get used to. No rush — you\'ve got this.' },
];

const STRINGS = {
  ja: {
    retryWrong:       n => `${n}問 復習する`,
    retryAgain:       'もう一度',
    titlePerfect:     '🎉 全問正解！',
    titleComplete:    'クイズ終了！',
    titleChallenge:   'チャレンジ終了！',
    rankChallenge:    n => { const t = CHALLENGE_TIERS.find(t => n >= t.min); return `${t.emoji} ${t.ja}`; },
    msgChallenge:     n => CHALLENGE_TIERS.find(t => n >= t.min).msgJa,
    timeLabelChallenge: 'クリア',
    timeLabelNormal:    'タイム',
    msg100:           'おめでとうございます！ この結果、ぜひシェアしてみませんか？',
    msg90:            '惜しい！ 全問正解まであと少しです。もう一度挑戦してみませんか？',
    msg75:            'いい感じです！ 誤答した数問をサッと復習して、全問正解を目指しましょう。',
    msg50:            '半分以上正解できています。続けるほど必ず身についていきます。ブックマークはお済みですか？',
    msg0:             '焦らず大丈夫。何度も繰り返すうちに少しずつ覚えていきます。よろしければブックマークをお願いします！',
    progressUnit:     '問',
    modeAlpha:        '固定順',
    modeAlphaVowel:   '固定順',
    lineText:         `ヘブライ語Alefbet道場\n旧約聖書を原典で読むための第一歩\n`,
    sharePrefix:      ['難読すぎる', '知る人ぞ知る', '3000年前の', '超難解'],
    shareLabelVowel:    '母音記号の正答率',
    shareLabelLetter:   'ヘブライ文字の正答率',
    shareLabelSyllable: '音節の正答率',
    shareLabelDagesh:   'ダゲシュクイズの正答率',
    shareChallenge:   'ヘブライ語に挑戦中✨',
    shareHashtag:     '#Alefbet道場',
    vowelLengthLabel: { 'ultra-short': '最短母音', 'sheva': 'シェワ', 'short': '短母音', 'long': '長母音', 'mixed': '' },
    correctMark:      '○',
    wrongMark:        '✕',
  },
  en: {
    retryWrong:       n => `Review ${n} missed`,
    retryAgain:       'Try Again',
    titlePerfect:     '🎉 Perfect Score!',
    titleComplete:    'Quiz Complete!',
    titleChallenge:   "Time's Up!",
    rankChallenge:    n => { const t = CHALLENGE_TIERS.find(t => n >= t.min); return `${t.emoji} ${t.en}`; },
    msgChallenge:     n => CHALLENGE_TIERS.find(t => n >= t.min).msgEn,
    timeLabelChallenge: 'Cleared',
    timeLabelNormal:    'Time',
    msg100:           'Congratulations! Want to share your result?',
    msg90:            'So close! Try one more time and go for a perfect score.',
    msg75:            'Nice work! Review the ones you missed and aim for a perfect score.',
    msg50:            'Over halfway there! Practice makes it stick. Bookmark this page to come back later.',
    msg0:             'Take it slow. Repetition makes it stick. Bookmark this page and come back anytime.',
    progressUnit:     '',
    modeAlpha:        'In Order',
    modeAlphaVowel:   'In Order',
    lineText:         `Hebrew Alefbet Dojo\nYour first step to reading the OT in Hebrew\n`,
    sharePrefix:      ['Ancient script', 'Right-to-left', '3,000-year-old', 'Hardest alphabet'],
    shareLabelVowel:    'Vowel accuracy: ',
    shareLabelLetter:   'Hebrew letter accuracy: ',
    shareLabelSyllable: 'Syllable accuracy: ',
    shareLabelDagesh:   'Dagesh quiz accuracy: ',
    shareChallenge:   'Studying Hebrew✨',
    shareHashtag:     '#AlefbetDojo',
    vowelLengthLabel: { 'ultra-short': 'Ultra-short', 'sheva': 'Sheva', 'short': 'Short', 'long': 'Long', 'mixed': '' },
    correctMark:      '✓',
    wrongMark:        '✗',
  },
};
const S = STRINGS[LANG];

// アルファベット順（語末形は直後に配置、シン・スィンを分離）= 28文字
const LETTERS = [
  { char: 'א',  name: 'アレフ',               romanized: 'Alef',          sound: 'ʾ'  , hint: '「牛の頭」が起源。声門の子音（ʾ）。覚え方：Aを回すと角っぽい。'},
  { char: 'ב',  name: 'ベート',               romanized: 'Bet',           sound: 'v'  , hint: '「家」が起源。創1:1の最初の文字はב（בְּרֵאשִׁית）で始まる。'},
  { char: 'ג',  name: 'ギメル',               romanized: 'Gimel',         sound: 'gh' , hint: '起源は諸説（ラクダなど）。G系の祖先とされる。'},
  { char: 'ד',  name: 'ダレト',               romanized: 'Dalet',         sound: 'dh' , hint: '「扉」が起源。רと混同注意：右上が角ばりやすいのがד。'},
  { char: 'ה',  name: 'ヘー',                 romanized: 'He',            sound: 'h'  , hint: '起源は諸説。左上が切れるのがה。上がつながるとח。'},
  { char: 'ו',  name: 'ワウ',                 romanized: 'Waw',           sound: 'w'  , hint: '「釘・鉤」が起源。יより縦が長い。接続詞「そして」で頻出。'},
  { char: 'ז',  name: 'ザイン',               romanized: 'Zayin',         sound: 'z'  , hint: '起源は諸説（武器など）。Z系の祖先とされる。'},
  { char: 'ח',  name: 'ヘート',               romanized: 'Het',           sound: 'ḥ' , hint: 'הに似るが、上がつながって閉じるのがח。喉の摩擦音（ḥ）。'},
  { char: 'ט',  name: 'テート',               romanized: 'Tet',           sound: 'ṭ' , hint: '起源は諸説。סと混同注意：טは内側に線が入る。'},
  { char: 'י',  name: 'ヨード',               romanized: 'Yod',           sound: 'y'  , hint: '「手」が起源。22文字で最小。וより縦が短い。'},
  { char: 'כ',  name: 'カフ',                 romanized: 'Kaf',           sound: 'kh' , hint: '「手のひら」が起源。K系の祖先。ダゲシュなしで /kh/。語尾はך。'},
  { char: 'ך',  name: 'カフ・ソフィット',     romanized: 'Kaf sofit',     sound: 'kh' , hint: 'כの語尾形。縦棒が下に大きく伸びる。音は同じ。'},
  { char: 'ל',  name: 'ラメド',               romanized: 'Lamed',         sound: 'l'  , hint: '「牛追いの棒」が起源。唯一、上に大きく突き出る文字。'},
  { char: 'מ',  name: 'メム',                 romanized: 'Mem',           sound: 'm'  , hint: '「水」が起源。M系の祖先。通常形は左下が少し開き、語尾はם。'},
  { char: 'ם',  name: 'メム・ソフィット',     romanized: 'Mem sofit',     sound: 'm'  , hint: 'מの語尾形。四角く完全に閉じる（通常形מは左下が少し開く）。'},
  { char: 'נ',  name: 'ヌン',                 romanized: 'Nun',           sound: 'n'  , hint: '起源は諸説。語尾ではןになり、縦棒が下に伸びる。'},
  { char: 'ן',  name: 'ヌン・ソフィット',     romanized: 'Nun sofit',     sound: 'n'  , hint: 'נの語尾形。縦棒が大きく下に伸びる（通常形נは短く丸い）。'},
  { char: 'ס',  name: 'サメフ',               romanized: 'Samekh',        sound: 's'  , hint: '起源は諸説。閉じた形。טは内側に線が入る。'},
  { char: 'ע',  name: 'アイン',               romanized: 'Ayin',          sound: 'ʿ' , hint: '「目」が起源。喉音（ʿ）：母音を支えるが本来は子音。'},
  { char: 'פ',  name: 'ペー',                 romanized: 'Pe',            sound: 'f'  , hint: '「口」が起源。P系の祖先。ダゲシュなしで /f/。語尾はף。'},
  { char: 'ף',  name: 'ペー・ソフィット',     romanized: 'Pe sofit',      sound: 'f'  , hint: 'פの語尾形。縦棒が下に垂れる。音は同じ。'},
  { char: 'צ',  name: 'ツァデー',             romanized: 'Tsade',         sound: 'ṣ' , hint: '起源は諸説（釣り針など）。「正義（צֶדֶק）」の頭文字でもある。語尾はץ。'},
  { char: 'ץ',  name: 'ツァデー・ソフィット', romanized: 'Tsade sofit',   sound: 'ṣ' , hint: 'צの語尾形。縦画が下に長く伸びる。'},
  { char: 'ק',  name: 'コーフ',               romanized: 'Qof',           sound: 'q'  , hint: '起源は諸説。Q系と関連。קָדוֹשׁ（聖）の頭文字。'},
  { char: 'ר',  name: 'レーシュ',             romanized: 'Resh',          sound: 'r'  , hint: '「頭」が起源。R系の祖先。דは角ばり、רは丸いのが目印。'},
  { char: 'שׂ', name: 'スィン',               romanized: 'Sin',           sound: 'ś' , hint: '左上の点がשׂ（sin /s/）、右上の点がשׁ（shin /sh/）。'},
  { char: 'שׁ', name: 'シン',                 romanized: 'Shin',          sound: 'š' , hint: '「歯」が起源。שָׁלוֹם（平和）・שַׁבָּת（安息日）の頭文字でもある。'},
  { char: 'ת',  name: 'タウ',                 romanized: 'Tav',           sound: 'th' , hint: '「しるし（tav）」が起源。T系の祖先。アレフベット22文字の最後。'},
];

const VOWELS = [
  { display: 'בֲ',  name: 'ハテフ・パタハ',      nameEn: 'Hateph Patah',          sounds: ['a'],        romanized: 'ă',    length: 'ultra-short' , hint: 'パタハ（横線）の下に2点を加えた形。א・ה・ח・ע の喉音文字専用の最短母音。'},
  { display: 'בֱ',  name: 'ハテフ・セゴル',      nameEn: 'Hateph Segol',          sounds: ['e'],        romanized: 'ĕ',    length: 'ultra-short' , hint: 'セゴル（逆三角3点）の下に2点を加えた形。喉音文字専用の最短母音「エ」。'},
  { display: 'בֳ',  name: 'ハテフ・カメツ',      nameEn: 'Hateph Qamets',         sounds: ['o'],        romanized: 'ŏ',    length: 'ultra-short' , hint: 'カメツ（T字型）の下に2点を加えた形。喉音文字専用の最短母音「オ」。'},
  { display: 'בְ',  name: '有音 / 無音シェワ',   nameEn: 'Vocal / Silent Sheva',  sounds: ['ə', '無音'], romanized: 'ə / –', length: 'sheva'       , hint: '縦に並ぶ2点。語頭・音節頭は有音（ə）、音節末は無音。位置で見分ける。'},
  { display: 'בַ',  name: 'パタハ',              nameEn: 'Patah',                 sounds: ['a'],        romanized: 'a',    length: 'short'       , hint: '横線1本。「開く」が語源。語末の喉音（ח・ע・ה）の前では位置が逆転する（フルティヴム）。'},
  { display: 'בִ',  name: 'ヒレク',              nameEn: 'Hiriq',                 sounds: ['i'],        romanized: 'i',    length: 'short'       , hint: '点1つだけ。短母音「イ」。ヨードが加わるとヒレク・ヨード（בִי・長音）になる。'},
  { display: 'בֻ',  name: 'キブツ',              nameEn: 'Qibbuts',               sounds: ['u'],        romanized: 'u',    length: 'short'       , hint: '斜めに並ぶ3点。短母音「ウ」。シュルク（וּ）はワウの縦棒の中に点がある。'},
  { display: 'בֶ',  name: 'セゴル',              nameEn: 'Segol',                 sounds: ['e'],        romanized: 'e',    length: 'short'       , hint: '「ブドウの房」が語源の逆三角形3点。ツェレ（横並び2点・長音）と混同注意。'},
  { display: 'בָ',  name: '大カメツ / 小カメツ', nameEn: 'Qamets / Qamets Hatuf', sounds: ['a', 'o'],   romanized: 'ā/o',  length: 'mixed'       , hint: 'T字型記号。頻度はアー（大）が多いが、閉じた非強勢音節ではオ（小カメツ）になる。'},
  { display: 'בֵ',  name: 'ツェレ',              nameEn: 'Tsere',                 sounds: ['e'],        romanized: 'ē',    length: 'long'        , hint: '横に並ぶ2点。長母音「エー」。逆三角形3点のセゴル（短母音「エ」）と混同注意。'},
  { display: 'בֹ',  name: 'ホレム',              nameEn: 'Holam',                 sounds: ['o'],        romanized: 'ō',    length: 'long'        , hint: '子音の「左肩」に1点。他のほぼすべての母音が文字の下に来る中で唯一、上に付く記号。'},
  { display: 'בָה', name: '大カメツ・ヘー',       nameEn: 'Qamets He',             sounds: ['a'],        romanized: 'â',    length: 'long'        , hint: '語末の無音ヘー（ה）＋直前のカメツで長音アー。ヘー自体は発音しない。'},
  { display: 'בִי', name: 'ヒレク・ヨード',       nameEn: 'Hiriq Yod',             sounds: ['i'],        romanized: 'î',    length: 'long'        , hint: 'ヒレク（点）にヨード（י）が加わった長音イー。ヨードは発音せず音を伸ばす役割。'},
  { display: 'בוּ', name: 'シュルク',            nameEn: 'Shuruq',                sounds: ['u'],        romanized: 'û',    length: 'long'        , hint: 'ワウ（ו）の縦棒の中に点。長母音「ウー」。斜め3点のキブツ（短音「ウ」）と混同注意。'},
  { display: 'בֵי', name: 'ツェレ・ヨード',       nameEn: 'Tsere Yod',             sounds: ['e'],        romanized: 'ê',    length: 'long'        , hint: 'ツェレ（横2点）にヨード（י）が加わった長音エー。ヨードは発音せず音を伸ばす役割。'},
  { display: 'בוֹ', name: 'ホレム・ワウ',         nameEn: 'Holam Waw',             sounds: ['o'],        romanized: 'ô',    length: 'long'        , hint: 'ワウ（ו）の上に点。長母音「オー」。点だけのホレム（文字の左肩）と区別。'},
];

// EN vowel alpha order: matches en/alefbet.html section order (ultra-short→sheva→short→long→long-mater)
const VOWELS_ALPHA_ORDER_EN = [0,1,2, 3, 4,7,5,8,6, 9,10, 11,14,12,15,13];

const VOWEL_SOUNDS = LANG === 'en'
  ? ['a', 'e', 'i', 'o', 'u', 'ə', '無音']
  : ['a', 'i', 'u', 'e', 'o', 'ə', '無音'];
// Randomized decoration pool for wrong choices (ə and 無音 excluded — always fixed)
const VOWEL_ROMANIZED_POOL = {
  'a': ['a', 'ā', 'ă', 'â'],
  'i': ['i', 'î'],
  'u': ['u', 'û'],
  'e': ['e', 'ē', 'ĕ', 'ê'],
  'o': ['o', 'ō', 'ŏ', 'ô'],
};
const VOWEL_SOUND_LABELS = LANG === 'en'
  ? ['a', 'e', 'i', 'o', 'u', 'ə', 'silent']
  : VOWEL_SOUNDS;

// 389 syllables: consonant × vowel mark combinations (including begadkephat dagesh variants)
const SYLLABLES = [
  { display: 'אַ', romanized: 'ʾa' },
  { display: 'אִ', romanized: 'ʾi' },
  { display: 'אֻ', romanized: 'ʾu' },
  { display: 'אֶ', romanized: 'ʾe' },
  { display: 'אָ', romanized: 'ʾā/o' },
  { display: 'אֵ', romanized: 'ʾē' },
  { display: 'אֹ', romanized: 'ʾō' },
  { display: 'אְ', romanized: 'ʾə/–' },
  { display: 'אֲ', romanized: 'ʾă' },
  { display: 'אֱ', romanized: 'ʾĕ' },
  { display: 'אֳ', romanized: 'ʾŏ' },
  { display: 'אָה', romanized: 'ʾâ' },
  { display: 'אִי', romanized: 'ʾî' },
  { display: 'אוּ', romanized: 'ʾû' },
  { display: 'אֵי', romanized: 'ʾê' },
  { display: 'אוֹ', romanized: 'ʾô' },
  { display: 'בַ', romanized: 'va' },
  { display: 'בַּ', romanized: 'ba' },
  { display: 'בִ', romanized: 'vi' },
  { display: 'בִּ', romanized: 'bi' },
  { display: 'בֻ', romanized: 'vu' },
  { display: 'בֻּ', romanized: 'bu' },
  { display: 'בֶ', romanized: 've' },
  { display: 'בֶּ', romanized: 'be' },
  { display: 'בָ', romanized: 'vā/o' },
  { display: 'בָּ', romanized: 'bā/o' },
  { display: 'בֵ', romanized: 'vē' },
  { display: 'בֵּ', romanized: 'bē' },
  { display: 'בֹ', romanized: 'vō' },
  { display: 'בֹּ', romanized: 'bō' },
  { display: 'בְ', romanized: 'və/–' },
  { display: 'בְּ', romanized: 'bə/–' },
  { display: 'בָה', romanized: 'vâ' },
  { display: 'בָּה', romanized: 'bâ' },
  { display: 'בִי', romanized: 'vî' },
  { display: 'בִּי', romanized: 'bî' },
  { display: 'בוּ', romanized: 'vû' },
  { display: 'בּוּ', romanized: 'bû' },
  { display: 'בֵי', romanized: 'vê' },
  { display: 'בֵּי', romanized: 'bê' },
  { display: 'בוֹ', romanized: 'vô' },
  { display: 'בּוֹ', romanized: 'bô' },
  { display: 'גַ', romanized: 'gha' },
  { display: 'גַּ', romanized: 'ga' },
  { display: 'גִ', romanized: 'ghi' },
  { display: 'גִּ', romanized: 'gi' },
  { display: 'גֻ', romanized: 'ghu' },
  { display: 'גֻּ', romanized: 'gu' },
  { display: 'גֶ', romanized: 'ghe' },
  { display: 'גֶּ', romanized: 'ge' },
  { display: 'גָ', romanized: 'ghā/o' },
  { display: 'גָּ', romanized: 'gā/o' },
  { display: 'גֵ', romanized: 'ghē' },
  { display: 'גֵּ', romanized: 'gē' },
  { display: 'גֹ', romanized: 'ghō' },
  { display: 'גֹּ', romanized: 'gō' },
  { display: 'גְ', romanized: 'ghə/–' },
  { display: 'גְּ', romanized: 'gə/–' },
  { display: 'גָה', romanized: 'ghâ' },
  { display: 'גָּה', romanized: 'gâ' },
  { display: 'גִי', romanized: 'ghî' },
  { display: 'גִּי', romanized: 'gî' },
  { display: 'גוּ', romanized: 'ghû' },
  { display: 'גּוּ', romanized: 'gû' },
  { display: 'גֵי', romanized: 'ghê' },
  { display: 'גֵּי', romanized: 'gê' },
  { display: 'גוֹ', romanized: 'ghô' },
  { display: 'גּוֹ', romanized: 'gô' },
  { display: 'דַ', romanized: 'dha' },
  { display: 'דַּ', romanized: 'da' },
  { display: 'דִ', romanized: 'dhi' },
  { display: 'דִּ', romanized: 'di' },
  { display: 'דֻ', romanized: 'dhu' },
  { display: 'דֻּ', romanized: 'du' },
  { display: 'דֶ', romanized: 'dhe' },
  { display: 'דֶּ', romanized: 'de' },
  { display: 'דָ', romanized: 'dhā/o' },
  { display: 'דָּ', romanized: 'dā/o' },
  { display: 'דֵ', romanized: 'dhē' },
  { display: 'דֵּ', romanized: 'dē' },
  { display: 'דֹ', romanized: 'dhō' },
  { display: 'דֹּ', romanized: 'dō' },
  { display: 'דְ', romanized: 'dhə/–' },
  { display: 'דְּ', romanized: 'də/–' },
  { display: 'דָה', romanized: 'dhâ' },
  { display: 'דָּה', romanized: 'dâ' },
  { display: 'דִי', romanized: 'dhî' },
  { display: 'דִּי', romanized: 'dî' },
  { display: 'דוּ', romanized: 'dhû' },
  { display: 'דּוּ', romanized: 'dû' },
  { display: 'דֵי', romanized: 'dhê' },
  { display: 'דֵּי', romanized: 'dê' },
  { display: 'דוֹ', romanized: 'dhô' },
  { display: 'דּוֹ', romanized: 'dô' },
  { display: 'הַ', romanized: 'ha' },
  { display: 'הִ', romanized: 'hi' },
  { display: 'הֻ', romanized: 'hu' },
  { display: 'הֶ', romanized: 'he' },
  { display: 'הָ', romanized: 'hā/o' },
  { display: 'הֵ', romanized: 'hē' },
  { display: 'הֹ', romanized: 'hō' },
  { display: 'הְ', romanized: 'hə/–' },
  { display: 'הֲ', romanized: 'hă' },
  { display: 'הֱ', romanized: 'hĕ' },
  { display: 'הֳ', romanized: 'hŏ' },
  { display: 'הָה', romanized: 'hâ' },
  { display: 'הִי', romanized: 'hî' },
  { display: 'הוּ', romanized: 'hû' },
  { display: 'הֵי', romanized: 'hê' },
  { display: 'הוֹ', romanized: 'hô' },
  { display: 'וַ', romanized: 'wa' },
  { display: 'וִ', romanized: 'wi' },
  { display: 'וֻ', romanized: 'wu' },
  { display: 'וֶ', romanized: 'we' },
  { display: 'וָ', romanized: 'wā/o' },
  { display: 'וֵ', romanized: 'wē' },
  { display: 'וֹ', romanized: 'wō' },
  { display: 'וְ', romanized: 'wə/–' },
  { display: 'וָה', romanized: 'wâ' },
  { display: 'וִי', romanized: 'wî' },
  { display: 'ווּ', romanized: 'wû' },
  { display: 'וֵי', romanized: 'wê' },
  { display: 'ווֹ', romanized: 'wô' },
  { display: 'זַ', romanized: 'za' },
  { display: 'זִ', romanized: 'zi' },
  { display: 'זֻ', romanized: 'zu' },
  { display: 'זֶ', romanized: 'ze' },
  { display: 'זָ', romanized: 'zā/o' },
  { display: 'זֵ', romanized: 'zē' },
  { display: 'זֹ', romanized: 'zō' },
  { display: 'זְ', romanized: 'zə/–' },
  { display: 'זָה', romanized: 'zâ' },
  { display: 'זִי', romanized: 'zî' },
  { display: 'זוּ', romanized: 'zû' },
  { display: 'זֵי', romanized: 'zê' },
  { display: 'זוֹ', romanized: 'zô' },
  { display: 'חַ', romanized: 'ḥa' },
  { display: 'חִ', romanized: 'ḥi' },
  { display: 'חֻ', romanized: 'ḥu' },
  { display: 'חֶ', romanized: 'ḥe' },
  { display: 'חָ', romanized: 'ḥā/o' },
  { display: 'חֵ', romanized: 'ḥē' },
  { display: 'חֹ', romanized: 'ḥō' },
  { display: 'חְ', romanized: 'ḥə/–' },
  { display: 'חֲ', romanized: 'ḥă' },
  { display: 'חֱ', romanized: 'ḥĕ' },
  { display: 'חֳ', romanized: 'ḥŏ' },
  { display: 'חָה', romanized: 'ḥâ' },
  { display: 'חִי', romanized: 'ḥî' },
  { display: 'חוּ', romanized: 'ḥû' },
  { display: 'חֵי', romanized: 'ḥê' },
  { display: 'חוֹ', romanized: 'ḥô' },
  { display: 'טַ', romanized: 'ṭa' },
  { display: 'טִ', romanized: 'ṭi' },
  { display: 'טֻ', romanized: 'ṭu' },
  { display: 'טֶ', romanized: 'ṭe' },
  { display: 'טָ', romanized: 'ṭā/o' },
  { display: 'טֵ', romanized: 'ṭē' },
  { display: 'טֹ', romanized: 'ṭō' },
  { display: 'טְ', romanized: 'ṭə/–' },
  { display: 'טָה', romanized: 'ṭâ' },
  { display: 'טִי', romanized: 'ṭî' },
  { display: 'טוּ', romanized: 'ṭû' },
  { display: 'טֵי', romanized: 'ṭê' },
  { display: 'טוֹ', romanized: 'ṭô' },
  { display: 'יַ', romanized: 'ya' },
  { display: 'יִ', romanized: 'yi' },
  { display: 'יֻ', romanized: 'yu' },
  { display: 'יֶ', romanized: 'ye' },
  { display: 'יָ', romanized: 'yā/o' },
  { display: 'יֵ', romanized: 'yē' },
  { display: 'יֹ', romanized: 'yō' },
  { display: 'יְ', romanized: 'yə/–' },
  { display: 'יָה', romanized: 'yâ' },
  { display: 'יִי', romanized: 'yî' },
  { display: 'יוּ', romanized: 'yû' },
  { display: 'יֵי', romanized: 'yê' },
  { display: 'יוֹ', romanized: 'yô' },
  { display: 'כַ', romanized: 'kha' },
  { display: 'כַּ', romanized: 'ka' },
  { display: 'כִ', romanized: 'khi' },
  { display: 'כִּ', romanized: 'ki' },
  { display: 'כֻ', romanized: 'khu' },
  { display: 'כֻּ', romanized: 'ku' },
  { display: 'כֶ', romanized: 'khe' },
  { display: 'כֶּ', romanized: 'ke' },
  { display: 'כָ', romanized: 'khā/o' },
  { display: 'כָּ', romanized: 'kā/o' },
  { display: 'כֵ', romanized: 'khē' },
  { display: 'כֵּ', romanized: 'kē' },
  { display: 'כֹ', romanized: 'khō' },
  { display: 'כֹּ', romanized: 'kō' },
  { display: 'כְ', romanized: 'khə/–' },
  { display: 'כְּ', romanized: 'kə/–' },
  { display: 'כָה', romanized: 'khâ' },
  { display: 'כָּה', romanized: 'kâ' },
  { display: 'כִי', romanized: 'khî' },
  { display: 'כִּי', romanized: 'kî' },
  { display: 'כוּ', romanized: 'khû' },
  { display: 'כּוּ', romanized: 'kû' },
  { display: 'כֵי', romanized: 'khê' },
  { display: 'כֵּי', romanized: 'kê' },
  { display: 'כוֹ', romanized: 'khô' },
  { display: 'כּוֹ', romanized: 'kô' },
  { display: 'לַ', romanized: 'la' },
  { display: 'לִ', romanized: 'li' },
  { display: 'לֻ', romanized: 'lu' },
  { display: 'לֶ', romanized: 'le' },
  { display: 'לָ', romanized: 'lā/o' },
  { display: 'לֵ', romanized: 'lē' },
  { display: 'לֹ', romanized: 'lō' },
  { display: 'לְ', romanized: 'lə/–' },
  { display: 'לָה', romanized: 'lâ' },
  { display: 'לִי', romanized: 'lî' },
  { display: 'לוּ', romanized: 'lû' },
  { display: 'לֵי', romanized: 'lê' },
  { display: 'לוֹ', romanized: 'lô' },
  { display: 'מַ', romanized: 'ma' },
  { display: 'מִ', romanized: 'mi' },
  { display: 'מֻ', romanized: 'mu' },
  { display: 'מֶ', romanized: 'me' },
  { display: 'מָ', romanized: 'mā/o' },
  { display: 'מֵ', romanized: 'mē' },
  { display: 'מֹ', romanized: 'mō' },
  { display: 'מְ', romanized: 'mə/–' },
  { display: 'מָה', romanized: 'mâ' },
  { display: 'מִי', romanized: 'mî' },
  { display: 'מוּ', romanized: 'mû' },
  { display: 'מֵי', romanized: 'mê' },
  { display: 'מוֹ', romanized: 'mô' },
  { display: 'נַ', romanized: 'na' },
  { display: 'נִ', romanized: 'ni' },
  { display: 'נֻ', romanized: 'nu' },
  { display: 'נֶ', romanized: 'ne' },
  { display: 'נָ', romanized: 'nā/o' },
  { display: 'נֵ', romanized: 'nē' },
  { display: 'נֹ', romanized: 'nō' },
  { display: 'נְ', romanized: 'nə/–' },
  { display: 'נָה', romanized: 'nâ' },
  { display: 'נִי', romanized: 'nî' },
  { display: 'נוּ', romanized: 'nû' },
  { display: 'נֵי', romanized: 'nê' },
  { display: 'נוֹ', romanized: 'nô' },
  { display: 'סַ', romanized: 'sa' },
  { display: 'סִ', romanized: 'si' },
  { display: 'סֻ', romanized: 'su' },
  { display: 'סֶ', romanized: 'se' },
  { display: 'סָ', romanized: 'sā/o' },
  { display: 'סֵ', romanized: 'sē' },
  { display: 'סֹ', romanized: 'sō' },
  { display: 'סְ', romanized: 'sə/–' },
  { display: 'סָה', romanized: 'sâ' },
  { display: 'סִי', romanized: 'sî' },
  { display: 'סוּ', romanized: 'sû' },
  { display: 'סֵי', romanized: 'sê' },
  { display: 'סוֹ', romanized: 'sô' },
  { display: 'עַ', romanized: 'ʿa' },
  { display: 'עִ', romanized: 'ʿi' },
  { display: 'עֻ', romanized: 'ʿu' },
  { display: 'עֶ', romanized: 'ʿe' },
  { display: 'עָ', romanized: 'ʿā/o' },
  { display: 'עֵ', romanized: 'ʿē' },
  { display: 'עֹ', romanized: 'ʿō' },
  { display: 'עְ', romanized: 'ʿə/–' },
  { display: 'עֲ', romanized: 'ʿă' },
  { display: 'עֱ', romanized: 'ʿĕ' },
  { display: 'עֳ', romanized: 'ʿŏ' },
  { display: 'עָה', romanized: 'ʿâ' },
  { display: 'עִי', romanized: 'ʿî' },
  { display: 'עוּ', romanized: 'ʿû' },
  { display: 'עֵי', romanized: 'ʿê' },
  { display: 'עוֹ', romanized: 'ʿô' },
  { display: 'פַ', romanized: 'fa' },
  { display: 'פַּ', romanized: 'pa' },
  { display: 'פִ', romanized: 'fi' },
  { display: 'פִּ', romanized: 'pi' },
  { display: 'פֻ', romanized: 'fu' },
  { display: 'פֻּ', romanized: 'pu' },
  { display: 'פֶ', romanized: 'fe' },
  { display: 'פֶּ', romanized: 'pe' },
  { display: 'פָ', romanized: 'fā/o' },
  { display: 'פָּ', romanized: 'pā/o' },
  { display: 'פֵ', romanized: 'fē' },
  { display: 'פֵּ', romanized: 'pē' },
  { display: 'פֹ', romanized: 'fō' },
  { display: 'פֹּ', romanized: 'pō' },
  { display: 'פְ', romanized: 'fə/–' },
  { display: 'פְּ', romanized: 'pə/–' },
  { display: 'פָה', romanized: 'fâ' },
  { display: 'פָּה', romanized: 'pâ' },
  { display: 'פִי', romanized: 'fî' },
  { display: 'פִּי', romanized: 'pî' },
  { display: 'פוּ', romanized: 'fû' },
  { display: 'פּוּ', romanized: 'pû' },
  { display: 'פֵי', romanized: 'fê' },
  { display: 'פֵּי', romanized: 'pê' },
  { display: 'פוֹ', romanized: 'fô' },
  { display: 'פּוֹ', romanized: 'pô' },
  { display: 'צַ', romanized: 'ṣa' },
  { display: 'צִ', romanized: 'ṣi' },
  { display: 'צֻ', romanized: 'ṣu' },
  { display: 'צֶ', romanized: 'ṣe' },
  { display: 'צָ', romanized: 'ṣā/o' },
  { display: 'צֵ', romanized: 'ṣē' },
  { display: 'צֹ', romanized: 'ṣō' },
  { display: 'צְ', romanized: 'ṣə/–' },
  { display: 'צָה', romanized: 'ṣâ' },
  { display: 'צִי', romanized: 'ṣî' },
  { display: 'צוּ', romanized: 'ṣû' },
  { display: 'צֵי', romanized: 'ṣê' },
  { display: 'צוֹ', romanized: 'ṣô' },
  { display: 'קַ', romanized: 'qa' },
  { display: 'קִ', romanized: 'qi' },
  { display: 'קֻ', romanized: 'qu' },
  { display: 'קֶ', romanized: 'qe' },
  { display: 'קָ', romanized: 'qā/o' },
  { display: 'קֵ', romanized: 'qē' },
  { display: 'קֹ', romanized: 'qō' },
  { display: 'קְ', romanized: 'qə/–' },
  { display: 'קָה', romanized: 'qâ' },
  { display: 'קִי', romanized: 'qî' },
  { display: 'קוּ', romanized: 'qû' },
  { display: 'קֵי', romanized: 'qê' },
  { display: 'קוֹ', romanized: 'qô' },
  { display: 'רַ', romanized: 'ra' },
  { display: 'רִ', romanized: 'ri' },
  { display: 'רֻ', romanized: 'ru' },
  { display: 'רֶ', romanized: 're' },
  { display: 'רָ', romanized: 'rā/o' },
  { display: 'רֵ', romanized: 'rē' },
  { display: 'רֹ', romanized: 'rō' },
  { display: 'רְ', romanized: 'rə/–' },
  { display: 'רָה', romanized: 'râ' },
  { display: 'רִי', romanized: 'rî' },
  { display: 'רוּ', romanized: 'rû' },
  { display: 'רֵי', romanized: 'rê' },
  { display: 'רוֹ', romanized: 'rô' },
  { display: 'שַׂ', romanized: 'śa' },
  { display: 'שִׂ', romanized: 'śi' },
  { display: 'שֻׂ', romanized: 'śu' },
  { display: 'שֶׂ', romanized: 'śe' },
  { display: 'שָׂ', romanized: 'śā/o' },
  { display: 'שֵׂ', romanized: 'śē' },
  { display: 'שֹׂ', romanized: 'śō' },
  { display: 'שְׂ', romanized: 'śə/–' },
  { display: 'שָׂה', romanized: 'śâ' },
  { display: 'שִׂי', romanized: 'śî' },
  { display: 'שׂוּ', romanized: 'śû' },
  { display: 'שֵׂי', romanized: 'śê' },
  { display: 'שׂוֹ', romanized: 'śô' },
  { display: 'שַׁ', romanized: 'ša' },
  { display: 'שִׁ', romanized: 'ši' },
  { display: 'שֻׁ', romanized: 'šu' },
  { display: 'שֶׁ', romanized: 'še' },
  { display: 'שָׁ', romanized: 'šā/o' },
  { display: 'שֵׁ', romanized: 'šē' },
  { display: 'שֹׁ', romanized: 'šō' },
  { display: 'שְׁ', romanized: 'šə/–' },
  { display: 'שָׁה', romanized: 'šâ' },
  { display: 'שִׁי', romanized: 'šî' },
  { display: 'שׁוּ', romanized: 'šû' },
  { display: 'שֵׁי', romanized: 'šê' },
  { display: 'שׁוֹ', romanized: 'šô' },
  { display: 'תַ', romanized: 'tha' },
  { display: 'תַּ', romanized: 'ta' },
  { display: 'תִ', romanized: 'thi' },
  { display: 'תִּ', romanized: 'ti' },
  { display: 'תֻ', romanized: 'thu' },
  { display: 'תֻּ', romanized: 'tu' },
  { display: 'תֶ', romanized: 'the' },
  { display: 'תֶּ', romanized: 'te' },
  { display: 'תָ', romanized: 'thā/o' },
  { display: 'תָּ', romanized: 'tā/o' },
  { display: 'תֵ', romanized: 'thē' },
  { display: 'תֵּ', romanized: 'tē' },
  { display: 'תֹ', romanized: 'thō' },
  { display: 'תֹּ', romanized: 'tō' },
  { display: 'תְ', romanized: 'thə/–' },
  { display: 'תְּ', romanized: 'tə/–' },
  { display: 'תָה', romanized: 'thâ' },
  { display: 'תָּה', romanized: 'tâ' },
  { display: 'תִי', romanized: 'thî' },
  { display: 'תִּי', romanized: 'tî' },
  { display: 'תוּ', romanized: 'thû' },
  { display: 'תּוּ', romanized: 'tû' },
  { display: 'תֵי', romanized: 'thê' },
  { display: 'תֵּי', romanized: 'tê' },
  { display: 'תוֹ', romanized: 'thô' },
  { display: 'תּוֹ', romanized: 'tô' },
];

// ベガドケファト6文字 × ダゲシュあり/なし = 12問（パタハで代表表示）
const DAGESH = [
  { display: 'בּ', romanized: 'b'  , hint: 'ダゲシュ（字内の点）ありで /b/。点がなければ摩擦音 /v/（ב）。'},
  { display: 'ב',  romanized: 'v'  , hint: 'ダゲシュなしで摩擦音 /v/。字内に点があれば /b/（בּ）。'},
  { display: 'גּ', romanized: 'g'  , hint: 'ダゲシュありで /g/。古典では点なしで gh（軟口蓋摩擦音）になる。'},
  { display: 'ג',  romanized: 'gh' , hint: '点なしで古典的な gh 音。現代ヘブライ語では /g/ と区別しない。'},
  { display: 'דּ', romanized: 'd'  , hint: 'ダゲシュありで /d/。古典では点なしで dh（英語 "this" の th に近い音）。'},
  { display: 'ד',  romanized: 'dh' , hint: '点なしで dh 音。英語の "this"・"the" の th に相当する歯間摩擦音。'},
  { display: 'כּ', romanized: 'k'  , hint: 'ダゲシュありで /k/。点なしは喉の奥の摩擦音 /kh/（バッハの ch）になる。'},
  { display: 'כ',  romanized: 'kh' , hint: '点なしで /kh/。バッハ（Bach）の ch や英語 "loch" の ch と同じ音。'},
  { display: 'פּ', romanized: 'p'  , hint: 'ダゲシュありで /p/。点なしで /f/。英語の p と f の関係と同じ。'},
  { display: 'פ',  romanized: 'f'  , hint: '点なしで /f/。ダゲシュ（字内の点）があれば /p/（פּ）になる。'},
  { display: 'תּ', romanized: 't'  , hint: 'ダゲシュありで /t/。古典では点なしで /θ/（英語 "think" の th）。'},
  { display: 'ת',  romanized: 'th' , hint: '点なしで古典的な /θ/ 音。英語の "think"・"thin" の th に近い。'},
];

const FONTS = [
  { value: 'Cardo',            style: 'セリフ',     styleEn: 'Serif',      previewSize: '1.2rem'  },
  { value: 'Frank Ruhl Libre', style: 'セリフ',     styleEn: 'Serif',      previewSize: '1.45rem' },
  { value: 'Heebo',            style: 'サンセリフ', styleEn: 'Sans-Serif', previewSize: '1.2rem'  },
  { value: 'Assistant',        style: 'サンセリフ', styleEn: 'Sans-Serif', previewSize: '1.4rem'  },
];

const STORAGE_KEY_FONT            = 'hebrew-quiz-font';
const STORAGE_KEY_MODE            = 'hebrew-quiz-mode';
const STORAGE_KEY_TYPE            = 'hebrew-quiz-type';
const STORAGE_KEY_CHALLENGE_BEST  = 'alefbet-challenge-best';
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
const hintBox      = document.getElementById('hint-box');

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

function pickWrongConsonantRomanized(correctIdx, count) {
  const correctSound = LETTERS[correctIdx].sound;
  const pool = LETTERS.filter((_, i) => i !== correctIdx && LETTERS[i].sound !== correctSound);
  return shuffle(pool).slice(0, count);
}

function pickWrongVowelNames(correctIdx, count) {
  const pool = VOWELS.filter((_, i) => i !== correctIdx);
  return shuffle(pool).slice(0, count);
}

function pickWrongSyllables(correctIdx, count) {
  const correctRomanized = SYLLABLES[correctIdx].romanized;
  const pool = SYLLABLES.filter((_, i) => i !== correctIdx && SYLLABLES[i].romanized !== correctRomanized);
  return shuffle(pool).slice(0, count);
}

function pickWrongDagesh(correctIdx, count) {
  // 対義語（同文字の逆ダゲシュ）を必ず含める
  const counterpartIdx = correctIdx % 2 === 0 ? correctIdx + 1 : correctIdx - 1;
  const pool = DAGESH.filter((_, i) => i !== correctIdx && i !== counterpartIdx);
  return shuffle([DAGESH[counterpartIdx], ...shuffle(pool).slice(0, count - 1)]);
}

function isVowelType() {
  return quizType === 'vowel' || quizType === 'vowel-name';
}

function isSyllableType() {
  return quizType === 'syllable';
}

function challengeBestEmoji() {
  const best = parseInt(localStorage.getItem(STORAGE_KEY_CHALLENGE_BEST) || '-1', 10);
  const tier = CHALLENGE_TIERS.find(t => best >= t.min);
  return tier ? tier.emoji : '🏆';
}

function updateChallengeIcon() {
  const el = document.getElementById('challenge-rank-icon');
  if (el) el.textContent = challengeBestEmoji();
}

function isDageshType() {
  return quizType === 'dagesh';
}

function getQuizData() {
  if (isDageshType())  return DAGESH;
  if (isSyllableType()) return SYLLABLES;
  if (isVowelType())   return VOWELS;
  return LETTERS;
}

function getCurrentHint() {
  if (isSyllableType()) return '';
  const data = getQuizData();
  const item = data[shuffledOrder[currentIndex]];
  return item && item.hint ? item.hint : '';
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
  if (isSyllableType()) {
    timerEl.textContent = formatTime(CHALLENGE_DURATION);
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      timerEl.textContent = formatTime(CHALLENGE_DURATION - elapsedSeconds);
      if (elapsedSeconds >= CHALLENGE_DURATION) finishQuiz();
    }, 1000);
  } else {
    timerEl.textContent = formatTime(0);
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      timerEl.textContent = formatTime(elapsedSeconds);
    }, 1000);
  }
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
  const data    = getQuizData();
  const indices = data.map((_, i) => i);
  if (isSyllableType()) {
    shuffledOrder = shuffle(indices);
  } else if (isDageshType()) {
    shuffledOrder = shuffle(indices);
  } else {
    if (selectedMode === 'alpha') {
      shuffledOrder = (LANG === 'en' && isVowelType()) ? VOWELS_ALPHA_ORDER_EN : indices;
    } else {
      shuffledOrder = shuffle(indices);
    }
  }
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
  if (hintBox) hintBox.textContent = '';

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

  const data      = getQuizData();
  const letterIdx = shuffledOrder[currentIndex];
  const correct   = data[letterIdx];

  updateProgressDisplay();

  letterEl.classList.remove('letter-correct', 'reverse-name');
  choicesEl.classList.remove('vowel-mode', 'reverse-mode');

  // Vowel length label (JA only)
  const vowelLabelEl = document.getElementById('vowel-length-label');
  if (vowelLabelEl) {
    if (quizType === 'vowel') {
      const lbl = S.vowelLengthLabel[correct.length] || '';
      const sep = LANG === 'en' ? ': ' : '：';
      vowelLabelEl.textContent = lbl ? `${lbl}${sep}${vowelName(correct)}` : vowelName(correct);
      vowelLabelEl.classList.remove('hidden');
    } else {
      vowelLabelEl.classList.add('hidden');
    }
  }

  if (quizType === 'vowel') {
    choicesEl.classList.add('vowel-mode');
    letterEl.textContent = correct.display;
    const labels = [...VOWEL_SOUND_LABELS];
    if (correct.length !== 'sheva') {
      // Set correct answer label(s) with diacritics
      const parts = correct.romanized.split(/\s*\/\s*/);
      correct.sounds.forEach((sound, i) => {
        const idx = VOWEL_SOUNDS.indexOf(sound);
        if (idx !== -1 && parts[i]) labels[idx] = parts[i];
      });
    }
    // Randomize wrong choice labels (a/e/i/o/u only; ə and 無音 always fixed)
    const correctSoundSet = new Set(correct.sounds);
    VOWEL_SOUNDS.slice(0, 5).forEach((sound, si) => {
      if (!correctSoundSet.has(sound) && VOWEL_ROMANIZED_POOL[sound]) {
        const pool = VOWEL_ROMANIZED_POOL[sound];
        labels[si] = pool[Math.floor(Math.random() * pool.length)];
      }
    });
    choiceBtns.forEach((btn, i) => {
      btn.textContent     = labels[i];
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
  } else if (quizType === 'syllable') {
    letterEl.textContent = correct.display;
    choiceBtns[4].classList.add('hidden');
    choiceBtns[4].dataset.correct = 'false';
    choiceBtns[5].classList.add('hidden');
    choiceBtns[5].dataset.correct = 'false';
    choiceBtns[6].classList.add('hidden');
    choiceBtns[6].dataset.correct = 'false';

    const wrongs  = pickWrongSyllables(letterIdx, 3);
    const choices = shuffle([correct, ...wrongs]);
    choiceBtns.forEach((btn, i) => {
      if (i >= 4) return;
      btn.textContent     = choices[i].romanized;
      btn.dataset.correct = (choices[i] === correct) ? 'true' : 'false';
    });
  } else if (quizType === 'dagesh') {
    letterEl.textContent = correct.display;
    choiceBtns[4].classList.add('hidden');
    choiceBtns[4].dataset.correct = 'false';
    choiceBtns[5].classList.add('hidden');
    choiceBtns[5].dataset.correct = 'false';
    choiceBtns[6].classList.add('hidden');
    choiceBtns[6].dataset.correct = 'false';

    const wrongs  = pickWrongDagesh(letterIdx, 3);
    const choices = shuffle([correct, ...wrongs]);
    choiceBtns.forEach((btn, i) => {
      if (i >= 4) return;
      btn.textContent     = choices[i].romanized;
      btn.dataset.correct = (choices[i] === correct) ? 'true' : 'false';
    });
  } else if (quizType === 'consonant-romanized') {
    letterEl.textContent = correct.char;
    choiceBtns[4].classList.add('hidden');
    choiceBtns[4].dataset.correct = 'false';
    choiceBtns[5].classList.add('hidden');
    choiceBtns[5].dataset.correct = 'false';
    choiceBtns[6].classList.add('hidden');
    choiceBtns[6].dataset.correct = 'false';

    const wrongs  = pickWrongConsonantRomanized(letterIdx, 3);
    const choices = shuffle([correct, ...wrongs]);
    choiceBtns.forEach((btn, i) => {
      if (i >= 4) return;
      btn.textContent     = choices[i].sound;
      btn.dataset.correct = (choices[i] === correct) ? 'true' : 'false';
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

function markCorrect() {
  letterEl.classList.add('letter-correct');
}

function revealCorrectChoices() {
  choiceBtns.forEach(b => {
    if (b.dataset.correct === 'true') b.classList.add('correct');
  });
}

function disableAllChoices() {
  choiceBtns.forEach(b => { b.disabled = true; });
}

function recordIncorrect() {
  incorrectCount++;
  incorrectIndices.push(shuffledOrder[currentIndex]);
}

function handleAnswer(btn) {
  if (answered) return;

  const isMulti = quizType === 'vowel' &&
    VOWELS[shuffledOrder[currentIndex]].sounds.length > 1;

  if (isMulti) {
    if (btn.dataset.correct === 'false') {
      answered = true;
      btn.classList.add('wrong');
      recordIncorrect();
      revealCorrectChoices();
      disableAllChoices();
      updateProgressDisplay();
      if (hintBox) hintBox.textContent = getCurrentHint();
      nextWrap.classList.remove('hidden');
    } else {
      btn.classList.add('correct');
      btn.disabled = true;
      selectedAnswers.push(btn.textContent);
      if (selectedAnswers.length >= VOWELS[shuffledOrder[currentIndex]].sounds.length) {
        answered = true;
        correctCount++;
        markCorrect();
        disableAllChoices();
        updateProgressDisplay();
        setTimeout(nextQuestion, 200);
      }
    }
    return;
  }

  answered = true;
  const isCorrect = btn.dataset.correct === 'true';

  if (isCorrect) {
    correctCount++;
    markCorrect();
  } else {
    btn.classList.add('wrong');
    recordIncorrect();
    revealCorrectChoices();
  }

  disableAllChoices();
  updateProgressDisplay();

  if (isCorrect) {
    setTimeout(nextQuestion, 200);
  } else {
    if (hintBox) hintBox.textContent = getCurrentHint();
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
  if (isSyllableType()) {
    progressBar.style.width = `${Math.min((elapsedSeconds / CHALLENGE_DURATION) * 100, 100)}%`;
    progressText.innerHTML =
      `<span class="progress-correct">${S.correctMark} ${correctCount}</span>` +
      `　<span class="progress-wrong">${S.wrongMark} ${incorrectCount}</span>`;
  } else {
    const questionNum = currentIndex + 1;
    const total       = shuffledOrder.length;
    progressBar.style.width = `${((questionNum - 1) / total) * 100}%`;
    progressText.innerHTML =
      `${questionNum} / ${total}${S.progressUnit}` +
      `　<span class="progress-correct">${S.correctMark} ${correctCount}</span>` +
      `　<span class="progress-wrong">${S.wrongMark} ${incorrectCount}</span>`;
  }
}

function computeResult() {
  const total = isSyllableType() ? (correctCount + incorrectCount) : shuffledOrder.length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  return { total, accuracy };
}

function getResultMessage(accuracy) {
  if (accuracy >= 100) return S.msg100;
  if (accuracy >= 90)  return S.msg90;
  if (accuracy >= 75)  return S.msg75;
  if (accuracy >= 50)  return S.msg50;
  return S.msg0;
}

function logQuizComplete(accuracy) {
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

function finishQuiz() {
  stopTimer();
  showResultScreen();

  const { accuracy } = computeResult();

  retryBtn.textContent = (!isSyllableType() && incorrectCount > 0)
    ? S.retryWrong(incorrectCount)
    : S.retryAgain;

  resultScore.innerHTML = `${accuracy}<span class="result-unit">%</span>`;
  document.getElementById('result-detail').innerHTML =
    `<span class="progress-correct">${S.correctMark} ${correctCount}</span>　<span class="progress-wrong">${S.wrongMark} ${incorrectCount}</span>`;

  const resultCard      = document.querySelector('.result-card');
  const resultTitle     = document.querySelector('.result-title');
  const resultTimeLabel = document.getElementById('result-time-label');
  const resultRank      = document.getElementById('result-rank');

  let msg;
  if (isSyllableType()) {
    resultTitle.classList.add('hidden');
    if (resultRank) {
      const [emoji, ...labelParts] = S.rankChallenge(correctCount).split(' ');
      resultRank.innerHTML = `<span class="rank-emoji">${emoji}</span><span class="rank-label">${labelParts.join(' ')}</span>`;
      resultRank.classList.remove('hidden');
    }
    if (resultTimeLabel) resultTimeLabel.textContent = S.timeLabelChallenge;
    resultTime.innerHTML = S.progressUnit
      ? `${correctCount}<span class="result-unit">${S.progressUnit}</span>`
      : `${correctCount}`;
    const prevBest = parseInt(localStorage.getItem(STORAGE_KEY_CHALLENGE_BEST) || '-1', 10);
    if (correctCount > prevBest) {
      localStorage.setItem(STORAGE_KEY_CHALLENGE_BEST, correctCount);
      updateChallengeIcon();
    }
    if (correctCount >= CHALLENGE_TIERS[1].min) {
      resultCard.classList.add('result-card--perfect');
      launchConfetti();
    } else {
      resultCard.classList.remove('result-card--perfect');
    }
    msg = S.msgChallenge(correctCount);
  } else if (accuracy === 100) {
    resultTitle.classList.remove('hidden');
    if (resultRank) resultRank.classList.add('hidden');
    resultTitle.textContent = S.titlePerfect;
    if (resultTimeLabel) resultTimeLabel.textContent = S.timeLabelNormal;
    resultTime.textContent = formatTime(elapsedSeconds);
    resultCard.classList.add('result-card--perfect');
    launchConfetti();
    msg = S.msg100;
  } else {
    resultTitle.classList.remove('hidden');
    if (resultRank) resultRank.classList.add('hidden');
    resultTitle.textContent = S.titleComplete;
    if (resultTimeLabel) resultTimeLabel.textContent = S.timeLabelNormal;
    resultTime.textContent = formatTime(elapsedSeconds);
    resultCard.classList.remove('result-card--perfect');
    msg = getResultMessage(accuracy);
  }

  resultMsg.textContent = msg;
  logQuizComplete(accuracy);
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
  const accuracy = Math.round((correctCount / shuffledOrder.length) * 100);
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
  const accuracy = Math.round((correctCount / shuffledOrder.length) * 100);
  gtag('event', 'share_click', {
    platform:  'x',
    quiz_type: quizType,
    accuracy:  accuracy,
  });
  const shareUrl = LANG === 'en' ? `${APP_URL}/en/` : APP_URL;
  let text;
  if (isSyllableType()) {
    text = LANG === 'en'
      ? `📜 Hebrew Alefbet 30-sec challenge:\n${S.rankChallenge(correctCount)} — ${correctCount} answered\n${S.shareHashtag} ${shareUrl}`
      : [
          `${S.sharePrefix[Math.floor(Math.random() * S.sharePrefix.length)]}${S.shareChallenge}`,
          `30秒チャレンジ ${S.rankChallenge(correctCount).replace(' ', '')}（${correctCount}問クリア）`,
          `${S.shareHashtag} ${shareUrl}`,
        ].join('\n');
  } else {
    const quizLabel = isDageshType() ? S.shareLabelDagesh
      : isVowelType() ? S.shareLabelVowel : S.shareLabelLetter;
    text = LANG === 'en'
      ? `📜 Hebrew Alefbet quiz: ${accuracy}% correct in ${formatTime(elapsedSeconds)}\n${S.shareHashtag} ${shareUrl}`
      : [
          `${S.sharePrefix[Math.floor(Math.random() * S.sharePrefix.length)]}${S.shareChallenge}`,
          `${quizLabel}${accuracy}% / ${formatTime(elapsedSeconds)}`,
          `${S.shareHashtag} ${shareUrl}`,
        ].join('\n');
  }

  const url = new URL('https://twitter.com/intent/tweet');
  url.searchParams.set('text', text);
  window.open(url.toString(), '_blank', 'noopener,noreferrer');
}

// --- Event listeners ---
function updateModeLabels() {
  const nameEl = document.querySelector('#mode-label-alpha .mode-option-name');
  if (nameEl) nameEl.innerHTML = isVowelType() ? S.modeAlphaVowel : S.modeAlpha;

  const modeSection = document.getElementById('mode-section');
  if (modeSection) modeSection.style.display = (isSyllableType() || isDageshType()) ? 'none' : '';
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
// Auto-show extra options if saved type is in the supplementary group
if (quizType === 'consonant-reverse' || quizType === 'vowel-name') {
  const typeOptions = document.getElementById('type-options');
  if (typeOptions) typeOptions.classList.add('show-all');
  const extraToggle = document.getElementById('extra-section-toggle');
  if (extraToggle) extraToggle.classList.add('open');
}


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

  // Debug: z → end challenge immediately
  if (e.key === 'z' && isSyllableType()) {
    elapsedSeconds = CHALLENGE_DURATION;
    finishQuiz();
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
updateChallengeIcon();
showStartScreen();
