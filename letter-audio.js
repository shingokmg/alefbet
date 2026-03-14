(function () {
  if (!('speechSynthesis' in window)) return;

  var ICON = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';

  function makePlayBtn(displayText, speakText, label, extraClass) {
    var btn = document.createElement('button');
    btn.className = 'audio-pill' + (extraClass ? ' ' + extraClass : '');
    btn.setAttribute('aria-label', label);
    btn.innerHTML = ICON + '<span>' + displayText + '</span>';
    btn.addEventListener('click', function () {
      speechSynthesis.cancel();
      btn.disabled = true;
      var u = new SpeechSynthesisUtterance(speakText);
      u.lang = 'he-IL';
      u.rate = 0.8;
      u.onend = function () { btn.disabled = false; };
      speechSynthesis.speak(u);
    });
    return btn;
  }

  // Hero: replace .letter-romanized with pill button (speaks the glyph → letter name)
  var glyphEl     = document.querySelector('.letter-glyph');
  var romanizedEl = document.querySelector('.letter-romanized');
  if (glyphEl && romanizedEl) {
    var heroBtn = makePlayBtn(
      romanizedEl.textContent.trim(),
      glyphEl.textContent.trim(),
      '文字名を再生',
      'audio-pill--hero'
    );
    romanizedEl.parentNode.replaceChild(heroBtn, romanizedEl);
  }

  // Word list: replace each .word-roman with pill button (speaks the Hebrew word)
  document.querySelectorAll('.word-item').forEach(function (item) {
    var wordEl  = item.querySelector('.word-hebrew');
    var romanEl = item.querySelector('.word-roman');
    if (!wordEl || !romanEl) return;

    var wordBtn = makePlayBtn(
      romanEl.textContent.trim(),
      wordEl.textContent.trim(),
      '単語を再生',
      'audio-pill--word'
    );
    romanEl.parentNode.replaceChild(wordBtn, romanEl);
  });
})();
