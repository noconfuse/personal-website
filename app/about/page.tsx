import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: '关于',
  description: `关于 ${siteConfig.person.name} — 独立开发者、前端游戏研发工程师。6年全栈研发经验，曾任喜马拉雅游戏研发工程师。擅长 React/Next.js、Cocos Creator、WebGL、TypeScript。提供网站开发、产品前端、游戏互动应用、技术架构咨询服务。`,
  openGraph: { title: `关于 — ${siteConfig.person.name}`, description: `关于 ${siteConfig.person.name} — 独立开发者、前端游戏研发工程师。`, images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: `关于 — ${siteConfig.person.name}`, description: `关于 ${siteConfig.person.name} — 独立开发者、前端游戏研发工程师。`, images: ['/og-image.png'] },
  alternates: { canonical: `${siteConfig.url}/about` },
};

export default function AboutPage() {
  const { person, aboutInterview } = siteConfig;
  return <main><div className="wrap">
    <div className="page-hero about-hero"><div className="eyebrow mono"><span className="eyebrow-dot" /> {aboutInterview.eyebrow}</div><h1>{aboutInterview.title.split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}<em>{line}</em></span>)}</h1><p>{aboutInterview.intro}</p></div>
    <section className="hire-section"><div className="hire-intro"><span className="mono">AVAILABLE FOR SELECT PROJECTS</span><h2>如果你有一个<br /><span>值得认真做的想法。</span></h2><p>我可以从一个模糊的念头开始，陪你把它变成真实、清晰、好用的产品。</p><a className="button primary" href={`mailto:${person.email}`}>聊聊你的项目 ↗</a></div><div className="service-list">{aboutInterview.services.map((service, index) => <article className="service-card" key={service.name}><span className="service-index mono">0{index + 1}</span><div><h3>{service.name}</h3><p>{service.detail}</p><div className="service-tags">{service.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div></article>)}</div></section>
    <section className="conversation"><div className="section-head"><span className="section-title">一场持续的对话</span><span className="section-count mono">01 / INTERVIEW</span></div><div className="conversation-list">{aboutInterview.questions.map((item, index) => <article className="conversation-item" key={item.question}><div className="conversation-index mono">0{index + 1}</div><div className="conversation-body"><div className="question-label mono">我问</div><h2>{item.question}</h2><div className="answer-label mono">你答</div><p>{item.answer}</p><blockquote>{item.principle}</blockquote><Link className="work-link" href={item.evidence === 'projects' ? '/projects' : '/posts'}>查看相关内容 ↗</Link></div></article>)}</div></section>
    <section className="skills-section"><div className="section-head"><span className="section-title">我能带来的东西</span><span className="section-count mono">02 / SKILLS</span></div><div className="skills-grid">{aboutInterview.skills.map((skill, index) => <div className="skill-item" key={skill.name}><span className="skill-number mono">0{index + 1}</span><h3>{skill.name}</h3><p>{skill.detail}</p></div>)}</div></section>
    <section className="process-section"><div className="section-head"><span className="section-title">合作会这样开始</span><span className="section-count mono">03 / PROCESS</span></div><div className="process-grid">{aboutInterview.process.map((step, index) => <div className="process-step" key={step}><span className="mono">0{index + 1}</span><strong>{step}</strong>{index < aboutInterview.process.length - 1 && <span className="process-arrow">→</span>}</div>)}</div></section>
    <section className="showcase-section"><div className="section-head"><span className="section-title">继续了解我</span><span className="section-count mono">04 / EXPLORE</span></div><div className="showcase-grid">{aboutInterview.showcase.map((item) => <Link className="showcase-item" href={item.href} key={item.label}><span className="mono">{item.label}</span><p>{item.description}</p><span className="showcase-arrow">↗</span></Link>)}</div></section>
  </div></main>;
}
