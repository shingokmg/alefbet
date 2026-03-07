'use strict';

const APP_URL = 'https://alefbet.jp';
const LANG = localStorage.getItem('alefbet-lang') === 'en' ? 'en' : 'ja';

const CHALLENGE_DURATION = 30;

const STRINGS = {
  ja: {
    retryWrong:       n => `${n}問 復習する`,
    retryAgain:       'もう一度',
    titlePerfect:     '🎉 全問正解！',
    titleComplete:    'クイズ終了！',
    titleChallenge:   'チャレンジ終了！',
    rankChallenge:    n => n >= 25 ? '👑 特級' :
                          n >= 20 ? '🥇 1級' :
                          n >= 15 ? '🥈 2級' :
                          n >= 10 ? '🥉 3級' :
                          n >=  5 ? '👏 4級' :
                                    '👍 5級',
    msgChallenge:     n => n >= 25 ? '極めて高いレベルの反射神経です！ もう文字を読むことで思考が止まることはないはずです。' :
                          n >= 20 ? '素晴らしい集中力と正確性です。ヘブライ語学習の確固たる土台が完成しました！' :
                          n >= 15 ? '見事です！ スムーズに読めるようになり、日々の修練の成果がはっきりと現れています。' :
                          n >= 10 ? '素晴らしい！ 文字と音がしっかりと結びついてきましたね。' :
                          n >=  5 ? '文字と音が繋がり始めましたね！ この調子で反復すれば、さらにスピードアップできます。' :
                                    'ナイスチャレンジ！ ヘブライ文字は最初は誰でも戸惑うものです。焦らずいきましょう。',
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
    correctMark:      '○',
    wrongMark:        '✕',
  },
  en: {
    retryWrong:       n => `Review ${n} missed`,
    retryAgain:       'Try Again',
    titlePerfect:     '🎉 Perfect Score!',
    titleComplete:    'Quiz Complete!',
    titleChallenge:   "Time's Up!",
    rankChallenge:    n => n >= 25 ? '👑 Master' :
                          n >= 20 ? '🥇 Tier 1' :
                          n >= 15 ? '🥈 Tier 2' :
                          n >= 10 ? '🥉 Tier 3' :
                          n >=  5 ? '👏 Tier 4' :
                                    '👍 Tier 5',
    msgChallenge:     n => n >= 25 ? 'Incredible speed! Reading Hebrew now feels second nature.' :
                          n >= 20 ? 'Outstanding focus and accuracy. You\'ve built a rock-solid foundation in Hebrew.' :
                          n >= 15 ? 'Impressive! You\'re reading smoothly — your daily practice is clearly paying off.' :
                          n >= 10 ? 'Great progress! The more you repeat, the faster you\'ll get.' :
                          n >=  5 ? 'Letters and sounds are starting to click. Keep going — you\'ll pick up speed.' :
                                    'Nice try! Hebrew letters take time to get used to. No rush — you\'ve got this.',
    timeLabelChallenge: 'Cleared',
    timeLabelNormal:    'Time',
    msg100:           'Perfect score! Want to share your result?',
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
    correctMark:      '✓',
    wrongMark:        '✗',
  },
};
const S = STRINGS[LANG];

// アルファベット順（語末形は直後に配置、シン・スィンを分離）= 28文字
const LETTERS = [
  { char: 'א',  name: 'アレフ',               romanized: 'Alef',          sound: 'ʾ'  },
  { char: 'ב',  name: 'ベート',               romanized: 'Bet',           sound: 'v'  },
  { char: 'ג',  name: 'ギメル',               romanized: 'Gimel',         sound: 'gh' },
  { char: 'ד',  name: 'ダレト',               romanized: 'Dalet',         sound: 'dh' },
  { char: 'ה',  name: 'ヘー',                 romanized: 'He',            sound: 'h'  },
  { char: 'ו',  name: 'ワウ',                 romanized: 'Waw',           sound: 'w'  },
  { char: 'ז',  name: 'ザイン',               romanized: 'Zayin',         sound: 'z'  },
  { char: 'ח',  name: 'ヘート',               romanized: 'Het',           sound: 'ḥ' },
  { char: 'ט',  name: 'テート',               romanized: 'Tet',           sound: 'ṭ' },
  { char: 'י',  name: 'ヨード',               romanized: 'Yod',           sound: 'y'  },
  { char: 'כ',  name: 'カフ',                 romanized: 'Kaf',           sound: 'kh' },
  { char: 'ך',  name: 'カフ・ソフィット',     romanized: 'Kaf sofit',     sound: 'kh' },
  { char: 'ל',  name: 'ラメド',               romanized: 'Lamed',         sound: 'l'  },
  { char: 'מ',  name: 'メム',                 romanized: 'Mem',           sound: 'm'  },
  { char: 'ם',  name: 'メム・ソフィット',     romanized: 'Mem sofit',     sound: 'm'  },
  { char: 'נ',  name: 'ヌン',                 romanized: 'Nun',           sound: 'n'  },
  { char: 'ן',  name: 'ヌン・ソフィット',     romanized: 'Nun sofit',     sound: 'n'  },
  { char: 'ס',  name: 'サメフ',               romanized: 'Samekh',        sound: 's'  },
  { char: 'ע',  name: 'アイン',               romanized: 'Ayin',          sound: 'ʿ' },
  { char: 'פ',  name: 'ペー',                 romanized: 'Pe',            sound: 'f'  },
  { char: 'ף',  name: 'ペー・ソフィット',     romanized: 'Pe sofit',      sound: 'f'  },
  { char: 'צ',  name: 'ツァデー',             romanized: 'Tsade',         sound: 'ṣ' },
  { char: 'ץ',  name: 'ツァデー・ソフィット', romanized: 'Tsade sofit',   sound: 'ṣ' },
  { char: 'ק',  name: 'コーフ',               romanized: 'Qof',           sound: 'q'  },
  { char: 'ר',  name: 'レーシュ',             romanized: 'Resh',          sound: 'r'  },
  { char: 'שׂ', name: 'スィン',               romanized: 'Sin',           sound: 'ś' },
  { char: 'שׁ', name: 'シン',                 romanized: 'Shin',          sound: 'š' },
  { char: 'ת',  name: 'タウ',                 romanized: 'Tav',           sound: 'th' },
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
  { display: 'בַּ', romanized: 'b'  },
  { display: 'בַ',  romanized: 'v'  },
  { display: 'גַּ', romanized: 'g'  },
  { display: 'גַ',  romanized: 'gh' },
  { display: 'דַּ', romanized: 'd'  },
  { display: 'דַ',  romanized: 'dh' },
  { display: 'כַּ', romanized: 'k'  },
  { display: 'כַ',  romanized: 'kh' },
  { display: 'פַּ', romanized: 'p'  },
  { display: 'פַ',  romanized: 'f'  },
  { display: 'תַּ', romanized: 't'  },
  { display: 'תַ',  romanized: 'th' },
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
  if (best >= 25) return '👑';
  if (best >= 20) return '🥇';
  if (best >= 15) return '🥈';
  if (best >= 10) return '🥉';
  if (best >=  5) return '👏';
  if (best >=  0) return '👍';
  return '🏆';
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
    shuffledOrder = selectedMode === 'alpha' ? indices : shuffle(indices);
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
  elapsedSeconds = 0;
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

  const data      = getQuizData();
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

function finishQuiz() {
  stopTimer();
  showResultScreen();

  const answered = isSyllableType() ? (correctCount + incorrectCount) : shuffledOrder.length;
  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 0;

  retryBtn.textContent = (!isSyllableType() && incorrectCount > 0)
    ? S.retryWrong(incorrectCount)
    : S.retryAgain;

  resultScore.innerHTML = `${accuracy}<span class="result-unit">%</span>`;
  document.getElementById('result-detail').innerHTML =
    `<span class="progress-correct">${S.correctMark} ${correctCount}</span>　<span class="progress-wrong">${S.wrongMark} ${incorrectCount}</span>`;

  const resultCard      = document.querySelector('.result-card');
  const resultTitle     = document.querySelector('.result-title');
  const resultTimeLabel = document.getElementById('result-time-label');

  let msg;
  const resultRank = document.getElementById('result-rank');
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
    if (correctCount >= 20) {
      resultCard.classList.add('result-card--perfect');
      launchConfetti();
    } else {
      resultCard.classList.remove('result-card--perfect');
    }
    msg = S.msgChallenge(correctCount);
  } else if (accuracy === 100) {
    resultTitle.classList.remove('hidden');
    if (resultRank) resultRank.classList.add('hidden');
    msg = S.msg100;
    resultTitle.textContent = S.titlePerfect;
    if (resultTimeLabel) resultTimeLabel.textContent = S.timeLabelNormal;
    resultTime.textContent = formatTime(elapsedSeconds);
    resultCard.classList.add('result-card--perfect');
    launchConfetti();
  } else {
    resultTitle.classList.remove('hidden');
    if (resultRank) resultRank.classList.add('hidden');
    resultTitle.textContent = S.titleComplete;
    if (resultTimeLabel) resultTimeLabel.textContent = S.timeLabelNormal;
    resultTime.textContent = formatTime(elapsedSeconds);
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
