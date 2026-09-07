'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/lib/use-chat';
import ChatMarkdown from '@/components/ChatMarkdown';

export default function ChatPanel({ greeting, suggestions, compact }: { greeting: string; suggestions: readonly string[]; compact?: boolean }) {
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
        <span className="mono chat-status"><span className={`chat-dot${streaming ? ' live' : ''}`} />{streaming ? '鹿码人正在思考…' : '鹿码人 · 在线'}</span>
        <button className="chat-reset mono" onClick={reset} type="button">新对话</button>
      </div>

      <div className="chat-scroll" ref={scrollRef}>
        {messages.map((message, index) => (
          <div className={`chat-msg ${message.role}`} key={index}>
            <span className="chat-who mono">{message.role === 'user' ? '你' : '鹿码人'}</span>
            <div className="chat-bubble">
              {message.role === 'assistant' && !message.content && streaming ? (
                <span className="chat-typing"><i /><i /><i /></span>
              ) : (
                <ChatMarkdown text={message.content} />
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
          placeholder="输入消息，回车发送…"
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
          <button className="chat-send stop" type="button" onClick={stop}>停</button>
        ) : (
          <button className="chat-send" type="button" onClick={() => submit()} disabled={!input.trim()}>发 ↗</button>
        )}
      </div>
    </div>
  );
}