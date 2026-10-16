// 让 App.tsx 的聊天气泡把表情链接显示成图片；回复引用里显示成「[表情]」。
// 用法：在 /opt/chuanhuatong 下运行 node scripts/render-stickers.mjs
// 找不到要改的地方就直接退出，不改文件；改之前备份为 App.tsx.bak2。
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';

const file = new URL('../frontend/src/App.tsx', import.meta.url);
let src = readFileSync(file, 'utf8');

if (src.includes('function renderRich(')) {
  console.log('✓ 已经改过了，跳过');
  process.exit(0);
}

function fail(msg) {
  console.error('✗ ' + msg + '。什么都没改，把这行截图给许望。');
  process.exit(1);
}
const count = (s, needle) => s.split(needle).length - 1;

const oldImport = 'import { stickerMarkdown, type Sticker } from "./stickers";';
if (count(src, oldImport) !== 1) fail('没找到表情的 import（先跑过 add-sticker-button.mjs 吗）');

const bubble = '{highlightedText(msg.text)}';
if (count(src, bubble) !== 1) fail(`气泡那一处找到 ${count(src, bubble)} 次，不是 1 次`);

const reply = '{msg.replyTo.text}';
const replyHits = count(src, reply);

const helper = [
  'import { stickerMarkdown, splitStickers, stickerPreview, type Sticker } from "./stickers";',
  '',
  'function renderRich(text: string) {',
  '  const parts = splitStickers(text);',
  '  if (!parts.some(part => part.kind === "sticker")) return highlightedText(text);',
  '  return parts.map((part, index) => part.kind === "sticker"',
  '    ? <img key={`st-${index}`} className="msg-sticker" src={part.url} alt={part.label || "表情"} loading="lazy" decoding="async" style={{ display:"block", maxWidth:160, maxHeight:160, borderRadius:10, margin:"2px 0" }} />',
  '    : <span key={`tx-${index}`}>{highlightedText(part.text)}</span>);',
  '}',
].join('\n');

src = src.replace(oldImport, helper);
src = src.replace(bubble, '{renderRich(msg.text)}');
if (replyHits >= 1) src = src.split(reply).join('{stickerPreview(msg.replyTo.text)}');

copyFileSync(file, new URL('../frontend/src/App.tsx.bak2', import.meta.url));
writeFileSync(file, src);
console.log(`✓ 气泡会显示表情图片了；回复引用改了 ${replyHits} 处（备份在 App.tsx.bak2）`);
