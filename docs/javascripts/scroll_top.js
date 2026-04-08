document.addEventListener('click', function (e) {
  var link = e.target.closest('.md-nav__link--active');
  if (!link) return;
  if ((link.getAttribute('href') || '').startsWith('#')) return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
