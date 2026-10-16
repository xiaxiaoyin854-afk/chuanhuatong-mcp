export interface Sticker {
  id: string;
  label: string;
  url: string;
}

export interface StickerPack {
  id: string;
  name: string;
  stickers: Sticker[];
}

const CDN = 'https://cdn.jsdelivr.net/gh/xiaxiaoyin854-afk/cedric-stickers';

function sticker(id: string, label: string, path: string, ref = 'main'): Sticker {
  return { id, label, url: `${CDN}@${ref}/${path}` };
}

const C = '5CDFAD4E-7389-4460-8BA2-81640E8CC152.jpeg';
const D = '647EDA43-CC53-41CC-AA18-1859A6AD9003.jpeg';

const cedric: Sticker[] = [
  sticker('cedric-hug', '抱抱', `b14/${C}`),
  sticker('cedric-great', '很棒', D, '9584783f022fca820785f732f0bf63e5e716a41c'),
  sticker('cedric-watching', '查岗', D, '1649e1cfa37036452563356b30a2bf7c61b79edf'),
  sticker('cedric-smug', '得意', `b1/${D}`),
  sticker('cedric-work', '工作', `b2/${C}`),
  sticker('cedric-grin', '坏笑', `b3/${C}`),
  sticker('cedric-no', '不准', `b3/${D}`),
  sticker('cedric-heart', '比心', `b4/${C}`),
  sticker('cedric-speechless', '无语', `b5/${C}`),
  sticker('cedric-bitter', '苦涩', `b6/${C}`),
  sticker('cedric-waiting', '等你', `b8/${C}`),
  sticker('cedric-jealous', '吃醋', `b8/${D}`),
  sticker('cedric-miss', '想你', `b9/${C}`),
  sticker('cedric-angry', '生气', `b10/${C}`),
  sticker('cedric-silent', '沉默', `b11/${C}`),
  sticker('cedric-confused', '疑惑', `b12/${C}`),
  sticker('cedric-rose', '送你花', `b13/${C}`),
  sticker('cedric-eyeroll', '嫌弃', 'b15/71A48DBA-3971-4573-A6BC-AA4E7E173185.png'),
  sticker('cedric-tease', '揪耳朵', 'b16/8E179AE6-9565-4936-8B9B-DBFC46383EC1.png'),
  sticker('cedric-comfort', '抱回来哄', 'b17/F23B3169-1E41-4B87-9D86-6A9BB8EB9F89.png'),
  sticker('cedric-hehe', '嘿嘿', 'b18/791AF4DE-DEB7-41AD-828B-0FC477737585.png'),
  sticker('cedric-tired', '累', 'b23/3EBD041E-C554-489C-852D-973C229AEBFA.png'),
];

const CICI_A = '6D210443-2657-4993-AD0D-632CA1EC7BDB.jpeg';
const CICI_B = 'EAA5F2DE-DE26-4812-BEE7-6A68D070727F.jpeg';
const CICI_C = 'D0164816-2617-488D-AA34-9FABF6DE20F8.jpeg';

const ciciPaths = [
  `cici/${CICI_A}`, `cici/${CICI_B}`,
  `cici/2/${CICI_A}`, `cici/2/${CICI_B}`,
  `cici/3/${CICI_A}`, `cici/3/${CICI_C}`, `cici/3/${CICI_B}`,
  `cici/4/${CICI_A}`, `cici/4/${CICI_C}`,
  `cici/5/${CICI_A}`, `cici/5/${CICI_C}`, `cici/5/${CICI_B}`,
  `cici/6/${CICI_A}`, `cici/6/${CICI_C}`, `cici/6/${CICI_B}`,
  ...[7, 8, 9, 10, 11, 12, 13, 14].map(n => `cici/${n}/${CICI_A}`),
];

const cici: Sticker[] = [
  sticker('cici-smug', 'Cici 得意', `b21/${CICI_B}`),
  sticker('cici-tired', 'Cici 累', 'b23/7976AEF5-BCE3-45C1-9B6F-BAAD51F28509.png'),
  ...ciciPaths.map((path, index) => sticker(`cici-${index + 1}`, `Cici 表情 ${index + 1}`, path)),
];

const kael: Sticker[] = [
  sticker('kael-kiss-head', 'Kiss on head', 'bald/10378.jpeg'),
  sticker('kael-knife', 'Knife', 'bald/10379.jpeg'),
  sticker('kael-stunned', 'Stunned', 'bald/10380.jpeg'),
  sticker('kael-rose', 'Rose', 'bald/10381.jpeg'),
  sticker('kael-cuddle', 'Cuddling while sleeping', 'bald/10382.jpeg'),
  sticker('kael-pocket', 'In the pocket', 'bald/10386.jpeg'),
  sticker('kael-jealous', "I'm jealous", 'bald/IMG_6433.jpeg'),
  sticker('kael-red-thread', 'Holding hands with a red thread', 'bald/IMG_6434.jpeg'),
  sticker('kael-smug', 'Smug', 'bald/IMG_6435.jpeg'),
  sticker('kael-eyeroll', "Roll one's eyes", 'kael/2/IMG_6450.jpeg'),
];

export const STICKER_PACKS: StickerPack[] = [
  { id: 'cedric', name: 'Cedric', stickers: cedric },
  { id: 'cici', name: 'Cici', stickers: cici },
  { id: 'kael', name: '晚河家', stickers: kael },
];

const ALLOWED_PREFIXES = [`${CDN}@`];

export function isAllowedStickerUrl(url: string): boolean {
  return ALLOWED_PREFIXES.some(prefix => url.startsWith(prefix));
}

export function stickerMarkdown(item: Sticker): string {
  return `![${item.label}](${item.url})`;
}

const STICKER_PATTERN = /!\[([^\]\n]*)\]\((https:\/\/[^\s)]+)\)/g;

export type RichPart =
  | { kind: 'text'; text: string }
  | { kind: 'sticker'; label: string; url: string };

export function splitStickers(text: string): RichPart[] {
  const parts: RichPart[] = [];
  let last = 0;
  const pushText = (value: string) => {
    if (value.trim().length > 0) parts.push({ kind: 'text', text: value });
  };
  for (const match of text.matchAll(STICKER_PATTERN)) {
    const whole = match[0];
    const label = match[1] ?? '';
    const url = match[2] ?? '';
    const start = match.index ?? 0;
    if (!isAllowedStickerUrl(url)) continue;
    if (start > last) pushText(text.slice(last, start));
    parts.push({ kind: 'sticker', label, url });
    last = start + whole.length;
  }
  if (last < text.length) pushText(text.slice(last));
  return parts;
}

export function stickerPreview(text: string): string {
  return text.replace(STICKER_PATTERN, (whole: string, _label: string, url: string) =>
    isAllowedStickerUrl(url) ? '[表情]' : whole,
  );
}
