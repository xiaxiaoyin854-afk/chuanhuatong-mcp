// 把表情包按钮和面板接到 App.tsx 里群聊真正在用的输入框上。
// 用法：在 /opt/chuanhuatong 下运行 node scripts/add-sticker-button.mjs
// 任何一处找不到都会直接退出，不改动文件；改之前会备份为 App.tsx.bak。
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';

const file = new URL('../frontend/src/App.tsx', import.meta.url);
const src = readFileSync(file, 'utf8');

if (src.includes('StickerPanel')) {
  console.log('✓ App.tsx 里已经有表情包了，跳过');
  process.exit(0);
}

const lines = src.split('\n');

function fail(msg) {
  console.error('✗ ' + msg + '。什么都没改，把这行截图给许望。');
  process.exit(1);
}

function findOne(test, name) {
  const hits = [];
  lines.forEach((line, i) => { if (test(line)) hits.push(i); });
  if (hits.length !== 1) fail(`没找到唯一的「${name}」（找到 ${hits.length} 处）`);
  return hits[0];
}

const indentOf = i => (lines[i].match(/^\s*/) || [''])[0];

const iImport = findOne(l => l.includes('from "./api/messages"'), 'messages 的 import');
const iSending = findOne(l => /const \[sending, setSending\] = useState/.test(l), 'sending 状态');
const iSendStart = findOne(l => /const send = useCallback/.test(l), 'send 函数');
let iSendEnd = -1;
for (let i = iSendStart + 1; i < Math.min(lines.length, iSendStart + 30); i++) {
  if (lines[i].trim().startsWith('}, [')) { iSendEnd = i; break; }
}
if (iSendEnd < 0) fail('没找到 send 函数的结尾');

const iPlaceholder = findOne(l => l.includes('placeholder="输入消息..."'), '输入框提示字');
let iInputTag = -1;
for (let i = iPlaceholder; i >= Math.max(0, iPlaceholder - 20); i--) {
  const t = lines[i].trim();
  if (t.startsWith('<textarea') || t.startsWith('<input')) { iInputTag = i; break; }
}
if (iInputTag < 0) fail('没找到输入框标签');

const iBar = findOne(l => /\{\/\*\s*Input bar/.test(l), 'Input bar 注释');
if (iBar > iInputTag) fail('输入框位置和预想的不一样');

const ind = i => indentOf(i);
const inserts = [
  [iImport + 1, [
    `import StickerPanel from "./components/StickerPanel";`,
    `import { stickerMarkdown, type Sticker } from "./stickers";`,
  ]],
  [iSending + 1, [
    `${ind(iSending)}const [showStickers, setShowStickers] = useState(false);`,
  ]],
  [iSendEnd + 1, [
    ``,
    `${ind(iSendStart)}const sendSticker = useCallback((item: Sticker) => {`,
    `${ind(iSendStart)}  if (sending) return;`,
    `${ind(iSendStart)}  setSending(true); setSendError(null);`,
    `${ind(iSendStart)}  void onSend(stickerMarkdown(item)).then(() => setShowStickers(false)).catch(error => setSendError(error instanceof Error ? error.message : "发送失败")).finally(() => setSending(false));`,
    `${ind(iSendStart)}}, [onSend, sending]);`,
  ]],
  [iBar, [
    `${ind(iBar)}{showStickers && (`,
    `${ind(iBar)}  <div style={{ padding:"0 12px 6px", position:"relative", zIndex:2 }}>`,
    `${ind(iBar)}    <StickerPanel disabled={sending} onPick={sendSticker} />`,
    `${ind(iBar)}  </div>`,
    `${ind(iBar)})}`,
  ]],
  [iInputTag, [
    `${ind(iInputTag)}<button type="button" onClick={() => setShowStickers(open => !open)} aria-label={showStickers ? "收起表情包" : "打开表情包"} style={{ background: showStickers ? "rgba(0,0,0,.06)" : "none", border:"none", borderRadius:14, padding:"4px 6px", fontSize:13, lineHeight:1, whiteSpace:"nowrap", flexShrink:0, cursor:"pointer", color:"var(--text)" }}>꒰ᐢ⸝⸝•༝•⸝⸝ᐢ꒱</button>`,
  ]],
];

inserts.sort((a, b) => b[0] - a[0]);
for (const [at, add] of inserts) lines.splice(at, 0, ...add);

copyFileSync(file, new URL('../frontend/src/App.tsx.bak', import.meta.url));
writeFileSync(file, lines.join('\n'));
console.log('✓ 表情包按钮已经加到 App.tsx（备份在 App.tsx.bak）');

if (!src.includes('MessageItem') && !src.includes('splitStickers')) {
  console.log('！提醒：App.tsx 自己画消息，发出去的表情可能先显示成一行链接，截图给许望再补一处');
}
