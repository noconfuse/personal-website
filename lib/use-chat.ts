'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export function useChat(initialGreeting: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: initialGreeting }]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      const history = [...messages, { role: 'user' as const, content: trimmed }];
      setMessages([...history, { role: 'assistant' as const, content: '' }]);
      setStreaming(true);
      setError('');

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch('/api/me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({ error: '请求失败' }));
          throw new Error(data.error || '请求失败');
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let done = false;

        while (!done) {
          const { value, done: finished } = await reader.read();
          if (finished) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith('data:')) continue;
            const payload = trimmedLine.slice(5).trim();
            if (payload === '[DONE]') {
              done = true;
              break;
            }
            try {
              const json = JSON.parse(payload);
              const delta = json.choices?.[0]?.delta?.content;
              if (typeof delta === 'string' && delta) {
                setMessages((current) => {
                  const next = current.slice();
                  const last = next[next.length - 1];
                  if (last?.role === 'assistant') {
                    next[next.length - 1] = { ...last, content: last.content + delta };
                  }
                  return next;
                });
              }
            } catch {
              // 忽略不完整的数据块
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          const message = err instanceof Error ? err.message : '出错了';
          setMessages((current) => {
            const next = current.slice();
            const last = next[next.length - 1];
            if (last?.role === 'assistant' && !last.content) {
              next[next.length - 1] = { ...last, content: `（刚才走神了：${message}）` };
            }
            return next;
          });
          setError(message);
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);
  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([{ role: 'assistant', content: initialGreeting }]);
    setStreaming(false);
    setError('');
  }, [initialGreeting]);

  return { messages, streaming, error, send, stop, reset };
}