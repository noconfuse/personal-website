'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/lib/use-chat';
import ChatMarkdown from '@/components/ChatMarkdown';

const uiText = {
  zh: { thinking: '鹿码人正在思考…', online: '鹿码人 · 在线', reset: '新对话', placeholder: '输入消息，回车发送…', stop: '停', send: '发 ↗', you: '你', who: '鹿码人' },
  en: { thinking: 'LuMaRen is thinking…', online: 'LuMaRen · Online', reset: 'New chat', placeholder: 'Type a message, Enter to send…', stop: 'Stop', send: 'Send ↗', you: 'You', who: 'LuMaRen' },
} as const;

export default function ChatPanel({ greeting, suggestions, compact, locale = 'zh' }: { greeting: string; suggestions: readonly string[]; compact?: boolean; locale?: 'zh' | 'en' }) {
  const t = uiText[locale];
  const { messages, streaming, send, stop, reset } = useChat(greeting);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  const submit = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || streaming) return;
    if (!text) setInput('');
    void send(value);
  };

  return (
    <div className={`chat-panel${compact ? ' compact' : ''}`}>
      <div className="chat-toolbar">
        <span className="mono chat-status"><span className={`chat-dot${streaming ? ' live' : ''}`} />{streaming ? t.thinking : t.online}</span>
        <button className="chat-reset mono" onClick={reset} type="button">{t.reset}</button>
      </div>

      <div className="chat-scroll" ref={scrollRef}>
        {messages.map((message, index) => (
          <div className={`chat-msg ${message.role}`} key={index}>
            <span className="chat-who mono">{message.role === 'user' ? t.you : t.who}</span>
            <div className="chat-bubble">
              {message.role === 'assistant' && !message.content && streaming ? (
                <span className="chat-typing"><i /><i /><i /></span>
              ) : (
                <ChatMarkdown text={message.content} locale={locale} />
              )}
            </div>
          </div>
        ))}
      </div>

      {messages.length <= 2 && (
        <div className="chat-suggestions">
          {suggestions.map((suggestion) => (
            <button className="chat-chip" key={suggestion} type="button" disabled={streaming} onClick={() => submit(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          rows={compact ? 1 : 2}
          placeholder={t.placeholder}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
        />
        {streaming ? (
          <button className="chat-send stop" type="button" onClick={stop}>{t.stop}</button>
        ) : (
          <button className="chat-send" type="button" onClick={() => submit()} disabled={!input.trim()}>{t.send}</button>
        )}
      </div>
    </div>
  );
}