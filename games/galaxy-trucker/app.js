(() => {
  'use strict';

  const quickDialog = document.querySelector('#quick-dialog');
  document.querySelector('[data-open-quick]')?.addEventListener('click', () => {
    if (quickDialog?.showModal) quickDialog.showModal();
    else location.hash = 'adventure';
  });
  quickDialog?.addEventListener('click', (event) => {
    if (event.target === quickDialog) quickDialog.close();
  });
  quickDialog?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => quickDialog.close());
  });

  const quiz = document.querySelector('[data-connector-quiz]');
  quiz?.querySelectorAll('[data-answer]').forEach((button) => {
    button.addEventListener('click', () => {
      const correct = button.dataset.answer === 'ng';
      quiz.classList.toggle('is-correct', correct);
      quiz.querySelector('output').textContent = correct
        ? '正解。1本 ↔ 2本 は接続できません。'
        : 'これは接続不可。コネクタの種類が一致していません。';
    });
  });

  const search = document.querySelector('#rule-search');
  const cards = [...document.querySelectorAll('#adventure-grid .adventure-card')];
  const noResults = document.querySelector('#no-results');
  search?.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase('ja');
    let visible = 0;
    cards.forEach((card) => {
      const haystack = `${card.dataset.keywords || ''} ${card.textContent}`.toLocaleLowerCase('ja');
      const match = !query || haystack.includes(query);
      card.hidden = !match;
      if (match) visible += 1;
    });
    noResults.hidden = visible !== 0;
  });

  const openTarget = () => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (!target) return;
    if (target instanceof HTMLDetailsElement) target.open = true;
    target.closest('details')?.setAttribute('open', '');
  };
  window.addEventListener('hashchange', openTarget);
  openTarget();

  const dockLinks = [...document.querySelectorAll('.mobile-dock a')];
  const observed = dockLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      dockLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${current.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { threshold: [0.15, 0.35], rootMargin: '-25% 0px -58% 0px' });
    observed.forEach((section) => navObserver.observe(section));
  }
})();
