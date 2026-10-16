import { useState } from 'react';
import { STICKER_PACKS, type Sticker } from '../stickers';
import './StickerPanel.css';

interface Props {
  disabled: boolean;
  onPick: (sticker: Sticker) => void;
}

export default function StickerPanel({ disabled, onPick }: Props) {
  const [packId, setPackId] = useState(STICKER_PACKS[0]?.id ?? '');
  const pack = STICKER_PACKS.find(item => item.id === packId) ?? STICKER_PACKS[0];

  return (
    <div className="sticker-panel" role="dialog" aria-label="表情包">
      <div className="sticker-tabs" role="tablist">
        {STICKER_PACKS.map(item => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === pack?.id}
            className={`sticker-tab${item.id === pack?.id ? ' active' : ''}`}
            onClick={() => setPackId(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="sticker-grid">
        {pack?.stickers.map(item => (
          <button
            key={item.id}
            type="button"
            className="sticker-cell"
            title={item.label}
            aria-label={item.label}
            disabled={disabled}
            onClick={() => onPick(item)}
          >
            <img src={item.url} alt={item.label} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </div>
  );
}
