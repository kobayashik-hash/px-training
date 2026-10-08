(() => {
  const themes = [
    ['01','クライアントに「この案で行くべき」と伝える表現','かなり控えめ','強く断言'],
    ['02','成果の良さを伝える言葉','まずまずの成果','圧倒的な成果'],
    ['03','問題の深刻さを伝える表現','少し気になる','極めて深刻'],
    ['04','相手に修正をお願いする表現','やんわりお願い','絶対に直してほしい'],
    ['05','広告コピーで「買いたい」と思わせる表現','少し気になる','今すぐ欲しい'],
    ['06','広告コピーで「今すぐ行動して」と促す表現','そっと背中を押す','今すぐ動かす'],
    ['07','広告コピーで商品の魅力を強く伝える表現','控えめに魅力を伝える','圧倒的に魅力的に見せる'],
    ['08','反対意見を伝える表現','やんわり懸念を伝える','明確に強く反対する'],
    ['09','相手への感謝を伝える表現','軽くお礼を伝える','最大級の感謝を伝える'],
    ['10','社内の無駄なモノ','まあ必要','今すぐなくしていい'],
    ['11','仕事ができる人だと感じる行動','ちょっと気が利く','圧倒的に仕事ができる'],
    ['12','インシデント内容（金額以外で表現）','軽微なトラブル','経営レベルの重大インシデント']
  ];

  const machine = document.querySelector('[data-theme-machine]');
  if (machine) {
    const number = machine.querySelector('[data-theme-number]');
    const title = machine.querySelector('[data-theme-title]');
    const low = machine.querySelector('[data-theme-low]');
    const high = machine.querySelector('[data-theme-high]');
    const history = machine.querySelector('[data-theme-history]');
    const random = machine.querySelector('[data-theme-random]');
    const list = document.querySelector('[data-theme-list]');
    let unused = themes.map((_, i) => i);
    let current = 7;
    let rolling = false;

    const show = index => {
      const [n,t,l,h] = themes[index];
      number.textContent = n; title.textContent = t; low.textContent = l; high.textContent = h;
      current = index;
    };
    const updateHistory = () => { history.textContent = `未使用 ${unused.length} / 12`; };
    themes.forEach((theme, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.innerHTML = `<b>${theme[0]}</b><span>${theme[1]}</span>`;
      button.addEventListener('click', () => { show(index); document.querySelector('.theme-picker').open = false; });
      list.append(button);
    });
    random.addEventListener('click', () => {
      if (rolling) return;
      rolling = true; random.disabled = true;
      if (!unused.length) unused = themes.map((_, i) => i).filter(i => i !== current);
      const pool = unused.filter(i => i !== current);
      const selected = pool[Math.floor(Math.random() * pool.length)];
      let ticks = 0;
      const timer = setInterval(() => { show(Math.floor(Math.random() * themes.length)); ticks += 1; }, 70);
      setTimeout(() => {
        clearInterval(timer); show(selected);
        unused = unused.filter(i => i !== selected); updateHistory();
        rolling = false; random.disabled = false;
      }, 630);
    });
    updateHistory();
  }

  const modal = document.querySelector('[data-visual-modal]');
  if (modal) {
    document.querySelectorAll('[data-open-visual]').forEach(button => button.addEventListener('click', () => modal.showModal()));
    modal.querySelector('[data-close-visual]').addEventListener('click', () => modal.close());
    modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
  }

  const gate = document.querySelector('[data-ito-gate]');
  if (gate) {
    const countOutput = gate.querySelector('[data-round-count]');
    const complete = gate.querySelector('[data-round-complete]');
    const reset = gate.querySelector('[data-round-reset]');
    const message = gate.querySelector('[data-gate-message]');
    const link = gate.querySelector('[data-insight-link]');
    let count = Math.min(2, Number(sessionStorage.getItem('ito-rounds') || 0));
    const render = () => {
      countOutput.textContent = count;
      const unlocked = count >= 2;
      complete.hidden = unlocked; link.hidden = !unlocked;
      message.textContent = unlocked ? '2ゲーム完了。体験を言葉にしてみましょう。' : `あと${2-count}ゲームで振り返りへ。`;
      gate.classList.toggle('is-unlocked', unlocked);
      sessionStorage.setItem('ito-rounds', String(count));
    };
    complete.addEventListener('click', () => { count = Math.min(2, count + 1); render(); });
    reset.addEventListener('click', () => { count = 0; render(); });
    render();
  }

  const slider = document.querySelector('[data-strength]');
  if (slider) {
    const output = document.querySelector('[data-strength-output]');
    const update = () => { output.value = slider.value; output.textContent = slider.value; slider.style.setProperty('--value', `${slider.value}%`); };
    slider.addEventListener('input', update); update();
  }
})();
