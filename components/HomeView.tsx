import type { Metadata } from 'next';
import Link from 'next/link';
import Ticker from '@/components/Ticker';
import WorkFilters from '@/components/WorkFilters';
import NoteList from '@/components/NoteList';
import HomeChat from '@/components/HomeChat';
import { getItems } from '@/lib/content';
import { getSiteConfig, type Locale } from '@/config/site';
import { buildMetadata, sharedMetadataFields } from '@/lib/metadata';
import { localePath } from '@/lib/i18n';

export function HomePage({ locale }: { locale: Locale }) {
  const config = getSiteConfig(locale);
  const postsPath = localePath(locale, '/posts');
  const projects = getItems('project', locale).filter((item) => item.featured).slice(0, config.home.featuredProjectLimit);
  const posts = getItems('post', locale);
  const { person, home } = config;
  const chatLink = locale === 'en' ? '/en#chat' : '#chat';
  const contactEmail = person.email;
  const emailCta = locale === 'en' ? 'Send an email ↗' : '发一封邮件 ↗';

  return <main><div className="wrap"><section className="hero"><div><div className="eyebrow mono"><span className="eyebrow-dot" /> {home.eyebrow}</div><h1>{home.headline}<br /><em>{home.headlineAccent}</em></h1><p className="hero-intro">{person.intro}</p><div className="hero-links"><Link className="button primary" href="#work">{home.primaryCta}</Link><Link className="button" href={chatLink}>{home.tertiaryCta}</Link></div></div><div className="hero-side"><div className="orbit"><div className="orbit-copy"><strong>∞</strong><span>{home.orbitLabel}</span></div><span className="orbit-tag one">{home.orbitTags[0].split('|').map((line) => <span key={line}>{line}<br /></span>)}</span><span className="orbit-tag two">{home.orbitTags[1].split('|').map((line) => <span key={line}>{line}<br /></span>)}</span></div></div></section></div><Ticker locale={locale} /><HomeChat locale={locale} /><div className="wrap"><section id="work"><div className="section-head"><span className="section-title">{home.workSectionTitle}</span><span className="section-count mono">02 / SELECTED WORK</span></div><WorkFilters items={projects} locale={locale} /></section><section id="notes"><div className="notes-layout"><div><div className="section-head" style={{ marginBottom: 25 }}><span className="section-title">{home.notesSectionTitle}</span><span className="section-count mono">03 / NOTES</span></div><p className="notes-lede">{home.notesIntro}</p><Link className="work-link" href={postsPath}>{locale === 'en' ? 'All notes ↗' : '查看全部文章 ↗'}</Link></div><NoteList items={posts} limit={home.recentPostLimit} locale={locale} /></div></section><section id="about"><div className="about"><h2>{home.aboutTitle.replace('{name}', person.name)}<br /><span>{home.aboutAccent}</span></h2><div className="about-copy"><p>{person.aboutLead}</p><p>{person.aboutDetail}</p><div className="facts">{person.facts.map(([label, value]) => <div className="fact" key={label}><span className="fact-label">{label}</span><span className="fact-value">{value}</span></div>)}</div></div></div></section></div><section id="contact" className="contact"><div className="wrap"><div className="contact-inner"><h2>{home.contactTitle}<br /><em>{home.contactAccent}</em></h2><a className="button" href={`mailto:${contactEmail}`}>{emailCta}</a></div></div></section></main>;
}

export function homeMetadata(locale: Locale): Metadata {
  const config = getSiteConfig(locale);
  const description = locale === 'en'
    ? `${config.person.name} — independent developer in Shanghai. 10 years of development: web front-end, game front-end at Ximalaya, now indie. TypeScript, React, Vue, Cocos Creator, Electron, Tauri, AI Agent. Maker of FateMesh, SpaceRoam, Toolkit.`
    : `${config.person.name} — ${config.person.role}。10 年开发经验（Web 前端 / 游戏前端 / 独立开发），擅长 TypeScript、React、Vue、Cocos Creator、Electron、Tauri、AI Agent。独立打造 FateMesh（AI 命理智能体平台）、SpaceRoam（3D 漫游工具）等产品。`;
  return { ...sharedMetadataFields, ...buildMetadata(locale, locale === 'en' ? '/en' : '/', { title: `${config.person.name} — ${config.person.role}`, description }) };
}