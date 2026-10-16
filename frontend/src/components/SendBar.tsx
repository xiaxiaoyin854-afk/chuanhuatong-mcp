import { useState } from 'react';
import { sendMessage } from '../api/messages';
import type { Message } from '../types';
import { stickerMarkdown, type Sticker } from '../stickers';
import StickerPanel from './StickerPanel';

interface Props {
  roomId: string;
  onSent: (message: Message) => void;
}

export default function SendBar({ roomId, onSent }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStickers, setShowStickers] = useState(false);

  const deliver = async (value: string): Promise<boolean> => {
    if (sending || value.trim().length === 0) return false;
    setSending(true);
    setError(null);
    try {
      const message = await sendMessage(roomId, value);
      onSent(message);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : '消息发送失败');
      return false;
    } finally {
      setSending(false);
    }
  };

  const submit = async () => {
    const value = text;
    if (await deliver(value)) setText('');
  };

  const sendSticker = async (sticker: Sticker) => {
    await deliver(stickerMarkdown(sticker));
  };

  return (
    <form
      className="send-bar"
      onSubmit={event => {
        event.preventDefault();
        void submit();
      }}
    >
      {showStickers && (
        <StickerPanel disabled={sending} onPick={sticker => void sendSticker(sticker)} />
      )}
      <div className="send-compose">
        <button
          type="button"
          className={`sticker-toggle${showStickers ? ' active' : ''}`}
          aria-label={showStickers ? '收起表情包' : '打开表情包'}
          aria-expanded={showStickers}
          onClick={() => setShowStickers(open => !open)}
        >
          😊
        </button>
        <textarea
          aria-label="消息"
          value={text}
          maxLength={32768}
          rows={1}
          placeholder="输入消息"
          disabled={sending}
          onChange={event => setText(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              void submit();
            }
          }}
        />
        <button
          type="submit"
          className={`send-button${text.trim().length > 0 ? ' has-text' : ''}`}
          disabled={sending || text.trim().length === 0}
          aria-label={sending ? '发送中' : '发送'}
        >
          {text.trim().length > 0 ? '发送' : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.7 3.3 3.9 9.7c-.8.3-.9 1.4-.1 1.8l6.2 2.8 2.8 6.2c.4.8 1.5.7 1.8-.1L21 3.6c.1-.2-.1-.4-.3-.3Zm-9.6 9.6 6.1-6.1" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="send-error" role="alert">{error}</p>}
    </form>
  );
}
