# Hebrew Alefbet Dojo

**Hebrew Alefbet Dojo** is a free web app for learning **Biblical Hebrew** letters and vowel marks (**niqqud**) through fast, multiple-choice quizzes. Available in **Japanese** and **English**.

- **Live demo:** https://alefbet.jp
- **English:** https://alefbet.jp/en/

---

## Features

### Hebrew Letter Quizzes (28 questions)
- Letter form → name
- Letter form → sound
- Name → letter form
- Fixed order or randomized

### Dagesh Quiz (12 questions)
- Letter (with / without dagesh) → sound

### Vowel Mark Quizzes (16 questions)
- Mark → sound
- Mark → name
- Two-choice questions for symbols with multiple readings (e.g., sheva, qamets)
- Fixed order or randomized

### 🏆 30-Second Challenge (389-question pool)
- Random questions from all categories — how many can you answer in 30 seconds?
- Earn ranks based on your score (Tier 5 → Master)
- Best score saved locally; confetti at **20+** correct answers

### Common Features
- Timed quizzes + accuracy tracking (%)
- Retry missed questions (standard quizzes only)
- Hints shown after incorrect answers
  (letter origin/mnemonics, visual tips for vowel marks, pronunciation rules for dagesh)
- On-screen guide (ⓘ) on the start screen
- Font switcher: Cardo / Frank Ruhl Libre / Heebo / Assistant
- Dark mode
- Share to X, LINE (JP), and the Web Share API (EN mobile)
- PWA with offline caching
- **517 questions** total

### Letter & Vowel Detail Pages
- Individual pages for all **22 letters** (`/letters/`) and **16 vowel marks** (`/vowels/`)
- Each page includes origin, pronunciation notes, and **10 Biblical Hebrew** example words
- Audio via the Web Speech API (`he-IL`) for letter names and example words

---

## Changelog

## 2026-03-14
- Added audio playback (Web Speech API) to all letter and vowel detail pages
- Added hints after incorrect answers
- Added vowel mark detail pages (`/vowels/`)
- Self-hosted fonts

## 2026-03-13
- Site-wide refactoring

## 2026-03-10
- Added individual detail pages for all 22 Hebrew letters (`/letters/`)

## 2026-03-08
- Added start-screen guide (ⓘ)
- Redesigned footer
- Added print button
- Improved vowel quiz UX

## 2026-03-07
- Added dagesh quiz
- Added letter-form → sound quiz
- Added 🏆 30-Second Challenge
- Added FAQ to contact page

## 2026-03-06
- Added 404 page with language detection
- Updated OGP images

## 2026-03-04
- Launched the English version
- Added dev story, contact form, and dark mode
- Added PWA support

## 2026-03-03
- Added Hebrew letters & vowel reference page
- Added retry for missed questions

## 2026-03-02
- Added vowel mark quizzes

## 2026-03-01
- Initial launch (Japanese only — 28 questions)

---

## i18n

All UI strings live in the `STRINGS` object in `app.js`. Pages under `/en/` set `alefbet-lang=en` in `localStorage`, and `app.js` uses that value to switch languages. The root `index.html` auto-redirects on first visit based on browser language (or `localStorage` if already set).

---

## Tech Stack

| | |
|---|---|
| Languages | HTML / CSS / Vanilla JavaScript |
| Fonts | Self-hosted WOFF2 (Cardo, Frank Ruhl Libre, Heebo, Assistant) |
| Hosting | GitHub Pages |
| Contact form | Formspree |
| Dependencies | None |

---

## Implementation Notes

### Hebrew Unicode
Hebrew is written right-to-left (RTL). Vowel marks (niqqud) are Unicode combining characters layered onto base consonants. Niqqud rendering can vary by font, so preview sizing is tuned per font.

### Two-choice questions
Some symbols share the same glyph but have different readings (e.g., vocal sheva vs. silent sheva, qamets vs. qamets hatuf). These are implemented as multi-answer questions: all correct choices must be selected, and selecting an incorrect option ends the question immediately.

### Shared `app.js`
Japanese and English pages share a single `app.js`. A `LANG` constant plus the `STRINGS` object handles text switching. Elements that differ between languages are guarded with null checks.

---

## File Structure

```
.
├── index.html          # Japanese main screen (start / quiz / result)
├── app.js              # Quiz logic, data, GA4 events (shared by both languages)
├── theme-toggle.js     # Theme toggle for pages that don't load app.js
├── letter-audio.js     # Audio playback for letter and vowel detail pages
├── sw.js               # Service Worker (cache: alefbet-v7)
├── sitemap.xml
├── css/
│   ├── base.css        # Shared CSS variables and reset
│   ├── style.css       # Main screen styles
│   ├── alefbet.css     # Reference page styles
│   ├── subpage.css     # Shared subpage styles
│   └── letter.css      # Letter / vowel detail page styles
├── fonts/              # Self-hosted WOFF2 × 10 (Hebrew + Latin subsets)
├── images/             # OGP images and favicons
├── letters/            # Letter detail pages (alef.html … tav.html, 22 files)
├── vowels/             # Vowel detail pages (patah.html … tsere.html, 16 files)
├── alefbet.html        # Japanese letter & vowel reference
├── about.html          # Japanese dev story
├── contact.html        # Japanese contact (with FAQ)
├── terms.html          # Japanese terms of use
├── privacy.html        # Japanese privacy policy
└── en/
    ├── index.html      # English main screen
    ├── alefbet.html    # English letter & vowel reference
    ├── about.html      # English dev story
    ├── contact.html    # English contact (with FAQ)
    ├── terms.html      # English terms of use
    └── privacy.html    # English privacy policy
```

