'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ChatPanel from '@/components/ChatPanel';
import { siteConfig } from '@/config/site';

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // 首页已有对话区，悬浮窗在首页不出现，避免重复
  const onHomePage = pathname === '/';

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (onHomePage) return null;

  return (
    <>
      {open && <div className="chat-overlay" onClick={() => setOpen(false)} />}
      <div className={`chat-fab-wrap${open ? ' open' : ''}`}>
        {open && (
          <div className="chat-fab-panel">
            <ChatPanel greeting={siteConfig.ai.greeting} suggestions={siteConfig.ai.suggestions} compact />
          </div>
        )}
        <button
          className="chat-fab"
          type="button"
          aria-label={open ? '关闭对话' : '和鹿码人聊聊'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? '×' : <span className="chat-fab-face">∞</span>}
        </button>
      </div>
    </>
  );
}