(() => {
  'use strict';

  const timerValue = document.querySelector('[data-timer-value]');
  const timerDial = document.querySelector('.timer-dial');
  const startButton = document.querySelector('[data-timer-start]');
  const resetButton = document.querySelector('[data-timer-reset]');
  let remaining = 60;
  let timerId = null;

  const renderTimer = () => {
    if (!timerValue || !timerDial) return;
    timerValue.textContent = remaining === 0 ? '終了' : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
    timerDial.style.setProperty('--progress', `${(remaining / 60) * 360}deg`);
    timerDial.setAttribute('aria-label', remaining === 0 ? '回答時間終了' : `残り${remaining}秒`);
    timerDial.classList.toggle('is-finished', remaining === 0);
  };

  startButton?.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      startButton.textContent = '再開';
      return;
    }
    if (remaining === 0) remaining = 60;
    startButton.textContent = '一時停止';
    timerId = window.setInterval(() => {
      remaining -= 1;
      renderTimer();
      if (remaining <= 0) {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'もう一度';
      }
    }, 1000);
    renderTimer();
  });

  resetButton?.addEventListener('click', () => {
    if (timerId) clearInterval(timerId);
    timerId = null;
    remaining = 60;
    if (startButton) startButton.textContent = '60秒スタート';
    renderTimer();
  });

  const modal = document.querySelector('[data-image-modal]');
  const modalImage = document.querySelector('[data-modal-image]');
  document.querySelectorAll('[data-open-image]').forEach((control) => {
    control.addEventListener('click', () => {
      if (!modal || !modalImage) return;
      modalImage.src = control.dataset.openImage;
      modalImage.alt = control.querySelector('img')?.alt || '言い換えの例';
      modal.showModal();
    });
  });
  document.querySelector('[data-close-image]')?.addEventListener('click', () => modal?.close());
  modal?.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
  renderTimer();
})();
