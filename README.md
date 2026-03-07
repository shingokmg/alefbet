# ヘブライ語Alefbet道場 / Hebrew Alefbet Dojo

古典ヘブライ語の文字・母音記号を択一クイズで学習できる無料Webアプリ。日本語・英語に対応。

A free web app for learning Biblical Hebrew letters and vowel marks through multiple-choice quizzes. Available in Japanese and English.

**本番URL / Live：https://alefbet.jp**
**English version：https://alefbet.jp/en/**

---

## 機能 / Features

**ヘブライ文字クイズ（28問） / Hebrew Letter Quizzes (28 questions)**
- 字形 → 名前 / Shape → Name：4択
- 字形 → 発音 / Shape → Sound：4択
- 名前 → 字形 / Name → Shape：4択
- ランダム順 / 固定順 / Random or fixed order

**ダゲシュクイズ（12問） / Dagesh Quiz (12 questions)**
- ダゲシュ あり/なし → 発音 / With or without dagesh → Sound：4択

**母音記号クイズ（16問） / Vowel Mark Quizzes (16 questions)**
- 母音記号 → 音 / Mark → Sound：6択
- 母音記号 → 名前 / Mark → Name：4択
- シェワとカメツは同一字形で読みが異なる2択問題
- ランダム順 / 固定順 / Random or fixed order

**🏆 30秒チャレンジ（389問プール） / 30-Second Challenge (389-question pool)**
- 全問からランダム出題。30秒で何問正解できるか挑戦 / Random questions from all categories — how many can you answer in 30 seconds?
- 正解数でランク判定（5級〜特級 / Tier 5〜Master）
- ベストスコア保存・紙吹雪演出（正解数20以上）/ Best score saved locally; confetti at 20+ correct

**共通機能 / Common Features**
- タイムアタック＆正答率（%）表示 / Timed quiz with accuracy display
- 誤答問題の復習モード（通常クイズのみ）/ Wrong-answer retry (standard quizzes only)
- スタート画面にガイド（ⓘ ボタン）/ Contextual guide (ⓘ buttons) on start screen
- フォント切り替え / Font switcher（Cardo / Frank Ruhl Libre / Heebo / Assistant）
- ダークモード / Dark mode
- X・LINE（日本語版）・Web Share API（英語版モバイル）でのシェア / Share on X, LINE (JA), Web Share API (EN mobile)
- PWA対応（オフラインキャッシュ）/ PWA with offline caching

全クイズ合計：**517問 / 517 questions total**

---

## Changelog

| Date | Changes |
|------|---------|
| 2026-03-08 | Added guide (ⓘ) to start screen |
| 2026-03-07 | Added 🏆 30-Second Challenge; added FAQ to contact page |
| 2026-03-04 | Launched English version; added dev story, contact form, dark mode |
| 2026-03-03 | Added Hebrew letters reference page; added wrong-answer retry |
| 2026-03-02 | Added vowel marks quiz |
| 2026-03-01 | Initial launch (Japanese only — 28 questions) |

---

## 多言語対応

`app.js` 内の `STRINGS` オブジェクトで日英の全UI文言を管理。`/en/` 配下のページが `localStorage` に `alefbet-lang=en` をセットし、`app.js` が読み取って言語を切り替える。ルートの `index.html` はブラウザ言語または `localStorage` に基づいて自動リダイレクト。

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| 言語 | HTML / CSS / JavaScript（バニラ） |
| フォント | Google Fonts（Cardo, Frank Ruhl Libre, Heebo, Assistant） |
| ホスティング | GitHub Pages |
| お問い合わせ | Formspree |
| 外部ライブラリ | なし |

フレームワーク不使用。依存関係ゼロで長期メンテナンスコストを抑えている。

---

## 実装の工夫

**ヘブライ語Unicodeの扱い**
ヘブライ文字は右から左（RTL）に記述され、母音記号（ニクド）は基底文字にUnicode結合文字を重ねて表現する。フォントによってニクドの描画サイズが異なるため、フォントごとにプレビューサイズを個別調整している。

**2択問題のロジック**
有音シェワ（`בְ`）と大カメツ / 小カメツ（`בָ`）は字形が同一で読みが異なる。1問に対して2つの選択肢を両方選ぶと正解となる独自のインタラクションを実装。選択順は問わず、誤答を選んだ時点で即終了する。

**日英共通のapp.js**
言語ごとにHTMLを分けつつ、ロジックは `app.js` 1ファイルで共有。`LANG` 定数と `STRINGS` オブジェクトで文言を切り替え、DOM要素の有無は null チェックで吸収している。

---

## ファイル構成

```
.
├── index.html        # 日本語メイン画面（スタート・クイズ・リザルト）
├── app.js            # クイズロジック・データ定義（日英共通）
├── style.css         # メイン画面スタイル
├── alefbet.html      # 日本語 文字・母音記号一覧
├── alefbet.css       # 一覧ページ用スタイル
├── about.html        # 日本語 開発ストーリー
├── contact.html      # 日本語 お問い合わせ
├── terms.html        # 日本語 利用規約
├── privacy.html      # 日本語 プライバシーポリシー
├── subpage.css       # サブページ共通スタイル
├── sw.js             # Service Worker
├── sitemap.xml
├── images/           # OGP画像・ファビコン一式
└── en/
    ├── index.html    # 英語メイン画面
    ├── alefbet.html  # 英語 文字・母音記号一覧
    ├── about.html    # 英語 開発ストーリー
    ├── contact.html  # 英語 お問い合わせ
    ├── terms.html    # 英語 利用規約
    └── privacy.html  # 英語 プライバシーポリシー
```
