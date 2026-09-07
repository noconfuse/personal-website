import type { Metadata } from 'next';
import Link from 'next/link';
import Ticker from '@/components/Ticker';
import WorkFilters from '@/components/WorkFilters';
import NoteList from '@/components/NoteList';
import HomeChat from '@/components/HomeChat';
import { getItems } from '@/lib/content';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: '首页',
  description: `${siteConfig.person.name} — ${siteConfig.person.role}。6年全栈研发经验，擅长 React/Next.js、Cocos Creator 游戏开发、WebGL 可视化。独立打造 FateMesh（AI 命理平台）、SpaceRoam（3D 漫游工具）等产品。`,
  openGraph: { title: `${siteConfig.person.name} — ${siteConfig.person.role}`, description: `${siteConfig.person.name} 的个人作品与思考。`, images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: `${siteConfig.person.name} — ${siteConfig.person.role}`, description: `${siteConfig.person.name} 的个人作品与思考。`, images: ['/og-image.png'] },
  alternates: { canonical: siteConfig.url },
};

export default function Home() { const projects = getItems('project').filter((item) => item.featured).slice(0, siteConfig.home.featuredProjectLimit); const posts = getItems('post'); const { person, home } = siteConfig; return <main><div className="wrap"><section className="hero"><div><div className="eyebrow mono"><span className="eyebrow-dot" /> {home.eyebrow}</div><h1>{home.headline}<br /><em>{home.headlineAccent}</em></h1><p className="hero-intro">{person.intro}</p><div className="hero-links"><Link className="button primary" href="#work">{home.primaryCta}</Link><Link className="button" href="#chat">{home.tertiaryCta}</Link></div></div><div className="hero-side"><div className="orbit"><div className="orbit-copy"><strong>∞</strong><span>{home.orbitLabel}</span></div><span className="orbit-tag one">{home.orbitTags[0].split('|').map((line) => <span key={line}>{line}<br /></span>)}</span><span className="orbit-tag two">{home.orbitTags[1].split('|').map((line) => <span key={line}>{line}<br /></span>)}</span></div></div></section></div><Ticker /><HomeChat /><div className="wrap"><section id="work"><div className="section-head"><span className="section-title">{home.workSectionTitle}</span><span className="section-count mono">02 / SELECTED WORK</span></div><WorkFilters items={projects} /></section><section id="notes"><div className="notes-layout"><div><div className="section-head" style={{ marginBottom: 25 }}><span className="section-title">{home.notesSectionTitle}</span><span className="section-count mono">03 / NOTES</span></div><p className="notes-lede">{home.notesIntro}</p><Link className="work-link" href="/posts">查看全部文章 ↗</Link></div><NoteList items={posts} limit={home.recentPostLimit} /></div></section><section id="about"><div className="about"><h2>{home.aboutTitle.replace('{name}', person.name)}<br /><span>{home.aboutAccent}</span></h2><div className="about-copy"><p>{person.aboutLead}</p><p>{person.aboutDetail}</p><div className="facts">{person.facts.map(([label, value]) => <div className="fact" key={label}><span className="fact-label">{label}</span><span className="fact-value">{value}</span></div>)}</div></div></div></section></div><section id="contact" className="contact"><div className="wrap"><div className="contact-inner"><h2>{home.contactTitle}<br /><em>{home.contactAccent}</em></h2><a className="button" href={`mailto:${person.email}`}>发一封邮件 ↗</a></div></div></section></main>; }
