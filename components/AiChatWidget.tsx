'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ChatPanel from '@/components/ChatPanel';
import { getSiteConfig, type Locale } from '@/config/site';

export default function AiChatWidget({ locale = 'zh' }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // 首页已有对话区，悬浮窗在首页不出现，避免重复
  const onHomePage = ['/', '/zh', '/en'].includes(pathname);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (onHomePage) return null;

  const config = getSiteConfig(locale);

  return (
    <>
      {open && <div className="chat-overlay" onClick={() => setOpen(false)} />}
      <div className={`chat-fab-wrap${open ? ' open' : ''}`}>
        {open && (
          <div className="chat-fab-panel">
            <ChatPanel greeting={config.ai.greeting} suggestions={config.ai.suggestions} compact locale={locale} />
          </div>
        )}
        <button
          className="chat-fab"
          type="button"
          aria-label={locale === 'en' ? 'Chat with LuMaRen' : '和鹿码人聊聊'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? '×' : <span className="chat-fab-face">∞</span>}
        </button>
      </div>
    </>
  );
}