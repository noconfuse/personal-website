'use client';

import ChatPanel from '@/components/ChatPanel';
import { siteConfig } from '@/config/site';

export default function HomeChat() {
  return (
    <section className="home-chat-section" id="chat">
      <div className="wrap">
        <div className="section-head">
          <span className="section-title">{siteConfig.ai.homeSection.title}</span>
          <span className="section-count mono">{siteConfig.ai.homeSection.count}</span>
        </div>
        <div className="home-chat-layout">
          <div className="home-chat-side">
            <p className="home-chat-lede">{siteConfig.ai.homeSection.lede}</p>
            <p className="home-chat-note mono">{siteConfig.ai.homeSection.note}</p>
          </div>
          <div className="home-chat-panel-wrap">
            <ChatPanel greeting={siteConfig.ai.greeting} suggestions={siteConfig.ai.suggestions} compact />
          </div>
        </div>
      </div>
    </section>
  );
}