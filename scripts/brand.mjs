import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../frontend/src/App.tsx', import.meta.url);
let s = readFileSync(file, 'utf8');

const swaps = [
  [
    '<div style={{ minHeight:"100%", display:"grid", placeItems:"center", padding:24, background:"var(--grouped)" }}>',
    '<div className="auth-page">',
  ],
  [
    '<div style={{ fontSize:34, fontWeight:700, color:"var(--text)", marginBottom:6 }}>传话筒</div>',
    '<img className="auth-logo" src="/apple-touch-icon.png?v=3" alt=""/><div className="auth-title">𝓖𝓻𝓸𝓾𝓹 𝓬𝓱𝓪𝓽</div>',
  ],
  [
    '<div style={{ color:"var(--text-2)", marginBottom:16 }}>使用传话筒 Web 账号</div>',
    '<div className="auth-subtitle">挤在一起，围同一条围巾</div>',
  ],
];

let n = 0;
for (const [from, to] of swaps) {
  if (s.includes(from)) { s = s.replace(from, to); n += 1; }
}
s = s.replaceAll('传话筒', '𝓖𝓻𝓸𝓾𝓹 𝓬𝓱𝓪𝓽');
writeFileSync(file, s);
console.log(`login page: ${n}/3 patched, old name left: ${s.includes('传话筒') ? 'yes' : 'no'}`);
