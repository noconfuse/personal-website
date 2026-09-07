'use client';

import ChatPanel from '@/components/ChatPanel';
import { getSiteConfig, type Locale } from '@/config/site';

export default function HomeChat({ locale = 'zh' }: { locale?: Locale }) {
  const config = getSiteConfig(locale);
  return (
    <section className="home-chat-section" id="chat">
      <div className="wrap">
        <div className="section-head">
          <span className="section-title">{config.ai.homeSection.title}</span>
          <span className="section-count mono">{config.ai.homeSection.count}</span>
        </div>
        <div className="home-chat-layout">
          <div className="home-chat-side">
            <p className="home-chat-lede">{config.ai.homeSection.lede}</p>
            <p className="home-chat-note mono">{config.ai.homeSection.note}</p>
          </div>
          <div className="home-chat-panel-wrap">
            <ChatPanel greeting={config.ai.greeting} suggestions={config.ai.suggestions} compact locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}