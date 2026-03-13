document.getElementById('theme-toggle').addEventListener('click', function() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('hebrew-quiz-theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('hebrew-quiz-theme', 'dark');
  }
});
