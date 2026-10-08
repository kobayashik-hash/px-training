(() => {
  const modal = document.querySelector('[data-image-modal]');
  const modalImage = document.querySelector('[data-modal-image]');

  document.querySelectorAll('[data-open-image]').forEach((control) => {
    control.addEventListener('click', () => {
      if (!modal || !modalImage) return;
      modalImage.src = control.dataset.openImage;
      modalImage.alt = control.querySelector('img')?.alt || control.textContent.trim() || '拡大したルール図';
      modal.showModal();
    });
  });

  document.querySelector('[data-close-image]')?.addEventListener('click', () => modal?.close());
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
})();
