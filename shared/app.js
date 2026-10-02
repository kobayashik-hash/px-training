(() => {
  'use strict';

  const gameId = document.body.dataset.game || 'splendor';

  const captureSection = new URLSearchParams(location.search).get('capture') ||
    (location.hash.startsWith('#capture-') ? location.hash.replace('#capture-', '') : '');
  if (captureSection) {
    document.querySelectorAll('main > .section-full').forEach((section) => {
      section.hidden = section.id !== captureSection;
    });
    requestAnimationFrame(() => {
      document.body.dataset.captureMetrics = JSON.stringify({
        viewport: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        sectionWidth: document.getElementById(captureSection)?.getBoundingClientRect().width || 0
      });
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const turnData = {
    takeDifferent: {
      label: 'アクション 01', heading: '異なる3色を1個ずつ取る',
      copy: '場にある宝石から、違う色を3個まで取ります。',
      note: '金貨はこの方法では取れません。',
      visual: `<div class="take-option single-take-option"><div class="take-gems different-gems"><span class="mini-gem gem-sapphire"></span><span class="mini-gem gem-ruby"></span><span class="mini-gem gem-emerald"></span></div><b>異なる3色を<br>1個ずつ</b></div>`
    },
    takeSame: {
      label: 'アクション 02', heading: '同じ色を2個取る',
      copy: '同じ色の宝石を、2個まとめて取ります。',
      note: '取る前に、その色の宝石が場に4個以上あるときだけ選べます。',
      visual: `<div class="take-option single-take-option"><div class="take-gems same-gems"><span class="mini-gem gem-sapphire"></span><span class="mini-gem gem-sapphire"></span></div><b>同じ色を<br>2個</b><small>場に4個以上ある色</small></div>`
    },
    buy: {
      label: 'アクション 03', heading: 'カードを買う',
      copy: '場のカードか、自分が予約したカードを1枚購入。カードは次の購入から永久割引になる。',
      note: '左下すべてが必要コスト。カードボーナスを差し引き、不足分を宝石で支払います。金貨は好きな色の代わりに使えます。場のカードはすぐ補充。',
      visual: `<div class="buy-action-visual">
        <div class="payment-gems"><span class="payment-token gem-sapphire"></span><span class="payment-token gem-onyx"></span><span class="payment-token gem-diamond"></span><b>宝石を支払う</b></div>
        <span class="action-arrow">→</span>
        <div class="acquired-card"><i class="gem-ruby"></i><strong>＋1</strong><b>カードを獲得</b></div>
      </div>`
    },
    reserve: {
      label: 'アクション 04', heading: 'カードを確保する',
      copy: '場のカードか、山札の一番上を手元へ。金貨が残っていれば1個獲得できます。',
      note: '金貨は、不足する好きな色の宝石1個の代わりに使えます。予約は最大3枚で、捨てることはできません。',
      visual: `<div class="reserve-action-visual"><div class="reserved-card"><span>予約</span><i>▣</i></div><b>＋</b><div class="gold-token gem-gold"><span>黄金</span></div></div>`
    }
  };

  const tabs = document.querySelectorAll('.turn-tab');
  const turnSymbol = document.querySelector('#turn-symbol');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.turn;
      const data = turnData[key];
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      document.querySelector('#turn-label').textContent = data.label;
      document.querySelector('#turn-heading').textContent = data.heading;
      document.querySelector('#turn-copy').textContent = data.copy;
      document.querySelector('#turn-note').textContent = data.note;
      if (turnSymbol) {
        turnSymbol.innerHTML = data.visual;
      }
    });
  });

  const setupByPlayers = {
    2: { nobles: '3枚', gems: '4個' },
    3: { nobles: '4枚', gems: '5個' },
    4: { nobles: '5枚', gems: '7個' }
  };
  const playerButtons = document.querySelectorAll('[data-players]');
  playerButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const setup = setupByPlayers[button.dataset.players];
      playerButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      document.querySelector('#noble-count').textContent = setup.nobles;
      document.querySelector('#gem-count').textContent = setup.gems;
    });
  });

  const unlockButton = document.querySelector('#unlock-insights');
  const insightLink = document.querySelector('#insight-link');
  const revealInsightLink = () => {
    if (!unlockButton || !insightLink) return;
    unlockButton.hidden = true;
    insightLink.hidden = false;
    document.querySelector('#insight-gate')?.classList.add('is-unlocked');
  };
  if (unlockButton && insightLink) {
    try {
      if (localStorage.getItem(`guild-${gameId}-complete`) === 'true') revealInsightLink();
    } catch (_) {
      // Storage can be unavailable in restricted or private browsing contexts.
    }
    unlockButton.addEventListener('click', () => {
      try { localStorage.setItem(`guild-${gameId}-complete`, 'true'); } catch (_) { /* no-op */ }
      revealInsightLink();
      insightLink.focus();
    });
  }

  document.querySelectorAll('.reflection-card').forEach((card) => {
    card.addEventListener('click', () => {
      const expanded = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', String(!expanded));
      const icon = card.querySelector('i');
      if (icon) icon.textContent = expanded ? '＋' : '−';
    });
  });

  const splendorCapabilityData = {
    asset: {
      code: '能力 01', title: '資産化',
      copy: 'その場で使う宝石を、何度も効くカードへ変える。仕事でも、ナレッジ・型・関係・自動化など、次のコストを下げる資産をつくる。',
      signal: '次の購入コストを下げる一手を選べたか'
    },
    investment: {
      code: '能力 02', title: '成長投資',
      copy: '目先の得点と、将来を有利にするボーナスを分けて考える。短期成果だけでなく、成長速度を上げる投資を選ぶ。',
      signal: '得点のないカードにも将来価値を見いだせたか'
    },
    opportunity: {
      code: '能力 03', title: '機会費用',
      copy: '持てる宝石は10個まで。何かを選ぶことは、別の何かを選ばないこと。限られた時間・人・予算でも同じ判断が起きる。',
      signal: '取らない宝石まで意識して選べたか'
    },
    backcast: {
      code: '能力 04', title: '逆算思考',
      copy: '場にある宝石から考えず、欲しいカードから必要条件と必要資源を逆算する。ゴール起点で一手を設計する。',
      signal: '二手・三手先から今の行動を決めたか'
    },
    timing: {
      code: '能力 05', title: '効率とスピード',
      copy: '効率よく買うか、1手を使って先に予約するか。競争下では、未来の選択肢を守る速さにも価値がある。',
      signal: '効率より先に動くべき瞬間を見極めたか'
    },
    market: {
      code: '能力 06', title: '競争理解',
      copy: '自分だけでなく、相手の宝石・ボーナス・狙いを見る。市場と競合の動きに合わせて、自分の最適解を更新する。',
      signal: '相手の次の一手を予測したか'
    }
  };
  const coyoteCapabilityData = {
    read: {
      code: '能力 01', title: '情報統合',
      copy: '断片的な情報を集め、全体像を組み立てる。数字だけでなく、状況の変化も判断材料にする力。',
      signal: '見えているカードを漏れなく判断に使えたか'
    },
    uncertainty: {
      code: '能力 02', title: '不確実性判断',
      copy: '自分のカードが分からなくても、分かる範囲から仮説を置いて進む。情報不足を理由に判断を止めない。',
      signal: '分からない情報を残したまま判断できたか'
    },
    calibration: {
      code: '能力 03', title: '仮説更新',
      copy: '宣言が上がるたびに、最初の予想へ固執せず見立てを更新する。新しい情報で判断基準を調整する。',
      signal: '直前の宣言から自分の見立てを更新したか'
    },
    dissent: {
      code: '能力 04', title: '異論提示',
      copy: '流れに乗り続けるだけでなく、前提が崩れたと感じた瞬間に止める。違和感を言葉と行動に変える。',
      signal: '疑いを持った時に「コヨーテ！」と言えたか'
    },
    risk: {
      code: '能力 05', title: 'リスク管理',
      copy: '一度の勝負だけでなく、残りライフまで含めて攻め方を選ぶ。損失の大きさに合わせて判断を変える。',
      signal: '残りライフに応じて宣言やコールを変えたか'
    },
    people: {
      code: '能力 06', title: '対人洞察',
      copy: '数字だけでなく、声の迷い・間・表情を見る。相手の反応を事実と分けながら判断材料にする。',
      signal: '相手の反応を読みつつ、思い込みと区別できたか'
    }
  };
  const galaxyTruckerCapabilityData = {
    prototype: {
      code: '能力 01', title: '仮説実行',
      copy: '情報も時間も十分ではない。それでも最低限の形をつくり、現実から学びながら前へ進める力。',
      signal: '完璧になる前に「飛ばす」と決められたか'
    },
    priority: {
      code: '能力 02', title: '優先順位',
      copy: 'すべてを載せるのではなく、目的に効く機能から確保する。重要なものと、今回は諦めるものを分ける力。',
      signal: '自分の航海方針に合う部品を先に選べたか'
    },
    risk: {
      code: '能力 03', title: 'リスク受容',
      copy: 'リスクをゼロにするのではなく、起きやすさと損失の大きさを見て、受け入れる弱点を選ぶ力。',
      signal: '露出面や不足機能を理解したうえで出発したか'
    },
    resource: {
      code: '能力 04', title: '資源配分',
      copy: '限りある余力を、目の前の成果と将来の危機へどう振り分けるか。使う時と残す時を選ぶ力。',
      signal: 'バッテリーを使う局面に明確な理由があったか'
    },
    resilience: {
      code: '能力 05', title: '再設計力',
      copy: '計画が壊れたあと、失ったものに固執せず、残った機能から新しい勝ち筋を組み直す力。',
      signal: '損傷後に残った船の強みを使って方針を変えたか'
    },
    withdrawal: {
      code: '能力 06', title: '撤退判断',
      copy: '投入済みのコストではなく、これから得られる成果と増える損失を見て、続行か撤退かを決める力。',
      signal: '続ける条件と諦める条件を分けて考えられたか'
    }
  };
  const capabilitySets = {
    splendor: splendorCapabilityData,
    coyote: coyoteCapabilityData,
    'galaxy-trucker': galaxyTruckerCapabilityData
  };
  const capabilityData = capabilitySets[gameId] || splendorCapabilityData;
  document.querySelectorAll('.decision-row').forEach((row) => {
    row.addEventListener('click', () => {
      const data = capabilityData[row.dataset.capability];
      if (!data) return;
      document.querySelectorAll('.decision-row').forEach((item) => item.classList.toggle('is-active', item === row));
      document.querySelector('#capability-code').textContent = data.code;
      document.querySelector('#capability-title').textContent = data.title;
      document.querySelector('#capability-copy').textContent = data.copy;
      document.querySelector('#capability-signal').textContent = data.signal;
    });
  });

  const splendorProfileData = {
    planner: ['設計者タイプ', '早い段階で勝ち筋を描き、必要な資源を積み上げる設計型。前提が変わった時の見直し時点を決めると、さらに強くなる。'],
    adapter: ['適応者タイプ', '盤面の変化から機会を見つけ、柔軟に進路を変える適応型。判断基準を言葉にすると、再現性が上がる。'],
    challenger: ['挑戦者タイプ', '競争相手の意図を読み、先回りして主導権を握る競争型。牽制に使う資源の上限を決めると、消耗を防げる。'],
    builder: ['構築者タイプ', '自分の成長エンジンを崩さず、着実に効率を高める構築型。外部変化を確認する周期を持つと、独走されにくい。'],
    optimizer: ['最適化タイプ', '同じ資源から最大の成果を得ることに敏感な効率型。小さな効率より大きな機会を選ぶ基準も持ちたい。'],
    opportunist: ['機会探索タイプ', '空いた市場や突然の好機を素早く取る機会型。機会を追う範囲を定めると、軸を失わずに済む。']
  };
  const coyoteProfileData = {
    cautious: ['慎重な検証者タイプ', '失敗を避けながら根拠を積み上げる慎重型。判断を先送りしすぎない期限を持つと、強みが生きる。'],
    bold: ['大胆な仮説型', '限られた情報から早く仮説を置き、場を動かす推進型。外れた時に小さく修正できる準備があると、さらに強い。'],
    analyst: ['情報分析タイプ', '見えている事実を整理し、数字から一貫した見立てを作る分析型。人の反応も補助情報にすると盲点が減る。'],
    observer: ['反応観察タイプ', '声や間の変化から、数字に出ない情報を拾う観察型。読みと事実を分けて記録すると再現性が上がる。'],
    challenger: ['早期提言タイプ', '違和感を早く言葉にして、流れを止められる提言型。反対する条件を先に決めると、勢いだけの判断を防げる。'],
    confirmer: ['確証重視タイプ', '材料を集めてから確度の高い判断を出す検証型。必要十分な情報の線引きを持つと、機会を逃しにくい。']
  };
  const galaxyTruckerProfileData = {
    'rapid|margin|persist': ['身軽な探検者タイプ', '早く動きながら余力を残し、想定外にも粘り強く対応する。速度を保ちつつ、どこで品質を上げるか決めるとさらに強い。'],
    'rapid|margin|withdraw': ['機敏なリスク調整者タイプ', '早く形にして選択肢を残し、損失が広がる前に進路を変えられる。撤退後の再投入先まで決めると判断が生きる。'],
    'rapid|output|persist': ['攻める完遂者タイプ', '機会を逃さず資源を投入し、壊れても前へ進み続ける。使い切る前に最低限の余力を定めると、継続力が増す。'],
    'rapid|output|withdraw': ['機会優先タイプ', '素早く成果を取りに行き、見込みが薄れれば切り替える。判断の速さを保ちながら、見切りの条件を先に共有すると周囲も動きやすい。'],
    'careful|margin|persist': ['堅牢な設計者タイプ', '完成度と余力を確保し、長い航海にも耐える。準備に使う時間の上限を決めると、強い設計を機会へつなげやすい。'],
    'careful|margin|withdraw': ['慎重な保全者タイプ', '弱点を減らし、余力を持って損失を抑える。安全性が十分になったと判断する基準を持つと、出発の遅れを防げる。'],
    'careful|output|persist': ['粘り強い最適化者タイプ', '完成度を高めたうえで資源を成果へ変え、最後までやり切る。守る対象を絞ると、投入量に見合う成果を得やすい。'],
    'careful|output|withdraw': ['現実的な再設計者タイプ', '品質へ投資しつつ、成果が見込めない時は損失を限定できる。途中の判断基準を置くと、完成度への投資をより活かせる。']
  };
  const profileSets = { splendor: splendorProfileData, coyote: coyoteProfileData };
  const profileData = profileSets[gameId] || splendorProfileData;
  const profileVotes = {};
  document.querySelectorAll('[data-profile]').forEach((button) => {
    button.addEventListener('click', () => {
      const pair = button.closest('.choice-pair');
      pair.querySelectorAll('button').forEach((item) => item.classList.toggle('is-selected', item === button));
      const questionIndex = [...document.querySelectorAll('.pattern-question')].indexOf(button.closest('.pattern-question'));
      profileVotes[questionIndex] = button.dataset.profile;
      const values = Object.values(profileVotes);
      if (values.length === 3) {
        const result = gameId === 'galaxy-trucker'
          ? galaxyTruckerProfileData[[0, 1, 2].map((index) => profileVotes[index]).join('|')]
          : profileData[values[2] || values[0]];
        if (!result) return;
        const [name, copy] = result;
        document.querySelector('#profile-name').textContent = name;
        document.querySelector('#profile-copy').textContent = copy;
      } else {
        document.querySelector('#profile-name').textContent = `${values.length} / 3`;
        document.querySelector('#profile-copy').textContent = '直感で選ぶ。正解ではなく、今回の傾向を見るための問いです。';
      }
    });
  });

  const coyoteTurnData = {
    raise: {
      label: 'ACTION 01 / RAISE',
      heading: '前の数字より、大きく。',
      copy: '前の宣言が実際の合計を超えていないと思ったら、前より大きな整数を宣言します。',
      note: '下げることはできません。宣言できる数字に上限はありません。',
      visual: '<div class="raise-meter" aria-hidden="true"><span>3</span><i>→</i><span>5</span><i>→</i><span>8</span><i>→</i><span>12</span></div>'
    },
    call: {
      label: 'ACTION 02 / CALL',
      heading: '超えたと思ったら、見破る。',
      copy: '直前のプレイヤーが宣言した数字が、実際のコヨーテ数より大きいと思ったら「コヨーテ！」と宣言します。',
      note: 'CALLしたら全員のカードを集め、基本カードの合計から特殊カードの効果を計算します。',
      visual: '<div class="call-visual" aria-hidden="true">COYOTE!</div>'
    }
  };

  document.querySelectorAll('.coyote-turn-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const data = coyoteTurnData[tab.dataset.coyoteTurn];
      document.querySelectorAll('.coyote-turn-tab').forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      document.querySelector('#coyote-turn-visual').outerHTML = data.visual.replace('class="', 'id="coyote-turn-visual" class="');
      document.querySelector('#coyote-turn-label').textContent = data.label;
      document.querySelector('#coyote-turn-heading').textContent = data.heading;
      document.querySelector('#coyote-turn-copy').textContent = data.copy;
      document.querySelector('#coyote-turn-note').textContent = data.note;
    });
  });

})();
