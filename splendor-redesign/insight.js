(() => {
  const consoleElement = document.querySelector('#pattern-console');
  const resultElement = document.querySelector('#pattern-result');
  if (!consoleElement || !resultElement) return;

  const profiles = {
    'planner|challenger|optimizer': {
      name: '先行設計タイプ',
      copy: '早い段階で勝ち筋を定め、相手より先に要所を押さえながら、最短距離で成果へ進むタイプ。計画の強さが武器になる一方、前提が変わった時の見直し時点を先に決めておくと、さらに安定します。'
    },
    'planner|challenger|opportunist': {
      name: '主導権設計タイプ',
      copy: '狙う方向を早めに決めつつ、相手の動きから生まれた好機を先に取りにいくタイプ。主導権を握る力が強みです。追う機会の範囲と、守る計画の境界を決めると判断がぶれません。'
    },
    'planner|builder|optimizer': {
      name: '成長設計タイプ',
      copy: '序盤から道筋を描き、自分の成長基盤を崩さず、効率よく積み上げるタイプ。再現性の高い進め方が強みです。外部の変化を確認する周期を持つと、計画の内側に閉じにくくなります。'
    },
    'planner|builder|opportunist': {
      name: '機会育成タイプ',
      copy: '長期の狙いを持ちながら、自分の基盤を育て、訪れた機会を成果へ変えるタイプ。準備と柔軟性を両立できます。機会に乗る条件を言葉にすると、投資の優先順位がさらに明確になります。'
    },
    'adapter|challenger|optimizer': {
      name: '機動的最適化タイプ',
      copy: '盤面の変化を読み、競争上の要所を素早く押さえ、限られた資源を効率よく使うタイプ。対応速度が強みです。短期の最適化が全体目標につながっているかを定期的に確かめると安定します。'
    },
    'adapter|challenger|opportunist': {
      name: '機会先行タイプ',
      copy: '変化から好機を見つけ、相手より先に踏み込んで主導権を取るタイプ。市場感度と決断の速さが強みです。追わない機会をあらかじめ決めると、消耗せずに強みを発揮できます。'
    },
    'adapter|builder|optimizer': {
      name: '適応型構築タイプ',
      copy: '状況に合わせて進路を変えながら、自分の基盤を着実に強くし、無駄を減らすタイプ。変化への強さと安定感を両立できます。判断基準を共有すると、周囲も同じ速度で動きやすくなります。'
    },
    'adapter|builder|opportunist': {
      name: '柔軟探索タイプ',
      copy: '盤面を観察し、自分の強みを育てながら、新しい可能性を試すタイプ。選択肢を残した進め方が得意です。探索を終えて一つに絞る条件を持つと、発見を確実な成果へつなげられます。'
    }
  };

  const answers = {};
  const axes = ['plan', 'rival', 'criterion'];
  const axisLabels = {
    plan: '勝ち筋',
    rival: '相手への向き合い方',
    criterion: '判断基準'
  };
  const outputIds = {
    plan: '#profile-plan',
    rival: '#profile-rival',
    criterion: '#profile-criterion'
  };

  consoleElement.querySelectorAll('.pattern-question button').forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      const question = button.closest('.pattern-question');
      const axis = question?.dataset.axis;
      if (!axis) return;

      question.querySelectorAll('button').forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });

      answers[axis] = {
        value: button.dataset.profile,
        label: button.textContent.trim()
      };

      if (!axes.every((key) => answers[key])) return;

      const key = axes.map((axisName) => answers[axisName].value).join('|');
      const profile = profiles[key];
      if (!profile) return;

      document.querySelector('#profile-name').textContent = profile.name;
      document.querySelector('#profile-copy').textContent = profile.copy;
      axes.forEach((axisName) => {
        document.querySelector(outputIds[axisName]).textContent = `${axisLabels[axisName]}｜${answers[axisName].label}`;
      });

      resultElement.hidden = false;
      requestAnimationFrame(() => resultElement.classList.add('is-revealed'));
      consoleElement.classList.add('is-complete');
    });
  });
})();
