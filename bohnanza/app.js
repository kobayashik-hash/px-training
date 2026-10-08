(() => {
  const modal = document.querySelector('[data-image-modal]');
  const modalImage = document.querySelector('[data-modal-image]');

  document.querySelectorAll('[data-open-image]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!modal || !modalImage) return;
      modalImage.src = button.dataset.openImage;
      modalImage.alt = button.querySelector('img')?.alt || '拡大したルール図';
      modal.showModal();
    });
  });

  document.querySelector('[data-close-image]')?.addEventListener('click', () => modal?.close());
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });

  const complete = document.querySelector('[data-game-complete]');
  const reset = document.querySelector('[data-game-reset]');
  const countNode = document.querySelector('[data-game-count]');
  const message = document.querySelector('[data-gate-message]');
  const link = document.querySelector('[data-insight-link]');
  const storageKey = 'guild-bohnanza-rounds';

  const readCount = () => {
    try { return Math.min(2, Math.max(0, Number(localStorage.getItem(storageKey)) || 0)); }
    catch (_) { return 0; }
  };
  const writeCount = (value) => {
    try { localStorage.setItem(storageKey, String(value)); } catch (_) { /* private mode */ }
  };
  const render = (count) => {
    if (!countNode || !message || !link || !complete) return;
    countNode.textContent = String(count);
    const unlocked = count >= 2;
    link.hidden = !unlocked;
    complete.hidden = unlocked;
    message.textContent = unlocked ? '2ゲーム完了。振り返りに進めます。' : `${2 - count}ゲーム終えると、振り返りに進めます。`;
  };
  let count = readCount();
  render(count);
  complete?.addEventListener('click', () => { count = Math.min(2, count + 1); writeCount(count); render(count); if (count === 2) link?.focus(); });
  reset?.addEventListener('click', () => { count = 0; writeCount(count); render(count); });
})();
