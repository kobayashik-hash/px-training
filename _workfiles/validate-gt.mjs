import fs from 'node:fs';

const port = 9224;
const width = Number(process.env.GT_WIDTH || 390);
const suffix = width === 390 ? '' : `-${width}`;
const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
const target = pages.find((page) => page.type === 'page') || pages[0];
const socket = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

const call = (method, params = {}) => new Promise((resolve, reject) => {
  const callId = ++id;
  pending.set(callId, { resolve, reject });
  socket.send(JSON.stringify({ id: callId, method, params }));
});
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const evaluate = async (expression) => {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
};
const screenshot = async (path) => {
  const result = await call('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  fs.writeFileSync(path, Buffer.from(result.data, 'base64'));
};

await call('Page.enable');
await call('Runtime.enable');
await call('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: true });
await call('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
const url = 'file:///C:/Users/hj1642/Desktop/%E3%81%99%E3%81%8D%E3%82%8B%E3%81%9A/px-strategic-training-redesign/games/galaxy-trucker/index.html';
await call('Page.navigate', { url });
await sleep(1300);
await evaluate(`document.documentElement.style.scrollBehavior='auto'`);

const base = 'C:/Users/hj1642/Desktop/すきるず/px-strategic-training-redesign/games/galaxy-trucker/previews';
await screenshot(`${base}/galaxy-trucker-mobile${suffix}-hero.png`);
const metrics = await evaluate(`({
  innerWidth,
  clientWidth: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
  bodyScrollWidth: document.body.scrollWidth,
  dockItems: document.querySelectorAll('.mobile-dock > *').length,
  imageLoaded: document.querySelector('.damage-visual img').complete && document.querySelector('.damage-visual img').naturalWidth > 0
})`);

await evaluate(`document.querySelector('#connectors').scrollIntoView({block:'start'}); document.querySelector('[data-answer="ng"]').click();`);
await sleep(450);
await screenshot(`${base}/galaxy-trucker-mobile${suffix}-connectors.png`);
const quiz = await evaluate(`document.querySelector('[data-connector-quiz] output').textContent`);

await evaluate(`document.querySelector('#adventure').scrollIntoView({block:'start'}); const q=document.querySelector('#rule-search'); q.value='流星'; q.dispatchEvent(new Event('input',{bubbles:true}));`);
await sleep(450);
await screenshot(`${base}/galaxy-trucker-mobile${suffix}-adventure-search.png`);
const visibleCards = await evaluate(`[...document.querySelectorAll('.adventure-card')].filter((card)=>!card.hidden).map((card)=>card.id)`);

await evaluate(`document.querySelector('#damage').scrollIntoView({block:'start'})`);
await sleep(300);
await screenshot(`${base}/galaxy-trucker-mobile${suffix}-damage.png`);

await evaluate(`document.querySelector('[data-open-quick]').click()`);
await sleep(250);
const quickOpen = await evaluate(`document.querySelector('#quick-dialog').open`);
const audit = await evaluate(`(() => {
  const ids=[...document.querySelectorAll('[id]')].map((node)=>node.id);
  const duplicates=[...new Set(ids.filter((value,index)=>ids.indexOf(value)!==index))];
  const unnamedButtons=[...document.querySelectorAll('button')].filter((button)=>!(button.textContent.trim()||button.getAttribute('aria-label'))).length;
  const missingAlt=[...document.querySelectorAll('img')].filter((img)=>!img.hasAttribute('alt')).length;
  return {duplicates,unnamedButtons,missingAlt,details:document.querySelectorAll('details').length};
})()`);

await call('Page.navigate', { url: 'file:///C:/Users/hj1642/Desktop/%E3%81%99%E3%81%8D%E3%82%8B%E3%81%9A/px-strategic-training-redesign/index.html' });
await sleep(900);
await evaluate(`document.documentElement.style.scrollBehavior='auto'; document.querySelector('.game-card-trucker').scrollIntoView({block:'center'})`);
await sleep(250);
await screenshot(`${base}/game-library${suffix}.png`);
const hubMetrics = await evaluate(`({innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyScrollWidth:document.body.scrollWidth,truckerLink:document.querySelector('.game-card-trucker a').getAttribute('href')})`);

console.log(JSON.stringify({ metrics, quiz, visibleCards, quickOpen, audit, hubMetrics }, null, 2));
socket.close();
