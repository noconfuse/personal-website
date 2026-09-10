import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteConfig, type Locale } from '@/config/site';
import { buildMetadata, sharedMetadataFields } from '@/lib/metadata';

const copy = {
  zh: {
    hire: { eyebrow: 'AVAILABLE FOR SELECT PROJECTS', title: ['如果你有一个', '值得认真做的想法。'], sub: '我可以从一个模糊的念头开始，陪你把它变成真实、清晰、好用的产品。', cta: '聊聊你的项目 ↗' },
    sections: { interview: '一场持续的对话', skills: '我能带来的东西', process: '合作会这样开始', showcase: '继续了解我' },
    labels: { iAsk: '我问', youAnswer: '你答', count: (n: number) => `0${n + 1}` },
  },
  en: {
    hire: { eyebrow: 'AVAILABLE FOR SELECT PROJECTS', title: ['Got an idea worth', 'taking seriously?'], sub: 'I can start from a vague thought and help you turn it into something real, clear and usable.', cta: 'Start a project ↗' },
    sections: { interview: 'An ongoing conversation', skills: 'What I bring', process: 'How a project starts', showcase: 'Keep exploring' },
    labels: { iAsk: 'Q', youAnswer: 'A', count: (n: number) => `0${n + 1}` },
  },
} as const;

export function AboutView({ locale }: { locale: Locale }) {
  const config = getSiteConfig(locale);
  const { person, aboutInterview: ai } = config;
  const t = copy[locale];
  const projectsPath = locale === 'en' ? '/en/projects' : '/projects';
  const postsPath = locale === 'en' ? '/en/posts' : '/posts';

  return <main><div className="wrap">
    <div className="page-hero about-hero"><div className="eyebrow mono"><span className="eyebrow-dot" /> {ai.eyebrow}</div><h1>{ai.title.split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}<em>{line}</em></span>)}</h1><p>{ai.intro}</p></div>
    <section className="hire-section"><div className="hire-intro"><span className="mono">{t.hire.eyebrow}</span><h2>{t.hire.title[0]}<br /><span>{t.hire.title[1]}</span></h2><p>{t.hire.sub}</p><a className="button primary" href={`mailto:${person.email}`}>{t.hire.cta}</a></div><div className="service-list">{ai.services.map((service, index) => <article className="service-card" key={service.name}><span className="service-index mono">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span><div><h3>{service.name}</h3><p>{service.detail}</p><div className="service-tags">{service.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div></article>)}</div></section>
    <section className="conversation"><div className="section-head"><span className="section-title">{t.sections.interview}</span><span className="section-count mono">01 / INTERVIEW</span></div><div className="conversation-list">{ai.questions.map((item, index) => <article className="conversation-item" key={item.question}><div className="conversation-index mono">{t.labels.count(index)}</div><div className="conversation-body"><div className="question-label mono">{t.labels.iAsk}</div><h2>{item.question}</h2><div className="answer-label mono">{t.labels.youAnswer}</div><p>{item.answer}</p><blockquote>{item.principle}</blockquote><Link className="work-link" href={item.evidence === 'projects' ? projectsPath : postsPath}>{locale === 'en' ? 'Related content ↗' : '查看相关内容 ↗'}</Link></div></article>)}</div></section>
    <section className="skills-section"><div className="section-head"><span className="section-title">{t.sections.skills}</span><span className="section-count mono">02 / SKILLS</span></div><div className="skills-grid">{ai.skills.map((skill, index) => <div className="skill-item" key={skill.name}><span className="skill-number mono">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span><h3>{skill.name}</h3><p>{skill.detail}</p></div>)}</div></section>
    <section className="process-section"><div className="section-head"><span className="section-title">{t.sections.process}</span><span className="section-count mono">03 / PROCESS</span></div><div className="process-grid">{ai.process.map((step, index) => <div className="process-step" key={step}><span className="mono">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span><strong>{step}</strong>{index < ai.process.length - 1 && <span className="process-arrow">→</span>}</div>)}</div></section>
    <section className="showcase-section"><div className="section-head"><span className="section-title">{t.sections.showcase}</span><span className="section-count mono">04 / EXPLORE</span></div><div className="showcase-grid">{ai.showcase.map((item) => <Link className="showcase-item" href={item.href} key={item.label}><span className="mono">{item.label}</span><p>{item.description}</p><span className="showcase-arrow">↗</span></Link>)}</div></section>
  </div></main>;
}

export function aboutMetadata(locale: Locale): Metadata {
  const config = getSiteConfig(locale);
  const description = locale === 'en'
    ? `About ${config.person.name} — indie developer, 10 years of development. Web front-end, game front-end at Ximalaya (Phaser.js/Cocos Creator), now indie. TypeScript, React, Vue, Node.js, Electron, Tauri, Python, AI Agent. Websites, product front-ends, interactive apps, architecture consulting.`
    : `关于 ${config.person.name} — 独立开发者，10 年开发经验。前 3 年 Web 前端（JavaScript/TypeScript/Node.js/React/Vue），3 年喜马拉雅游戏前端（Phaser.js/Cocos Creator），现为独立开发（Python/Electron/Tauri 等）。擅长 TypeScript、React、Vue、Cocos Creator、Electron、Tauri、AI Agent。提供网站开发、产品前端、游戏互动应用、技术架构咨询服务。`;
  const title = locale === 'en' ? 'About' : '关于';
  return { ...sharedMetadataFields, ...buildMetadata(locale, locale === 'en' ? '/en/about' : '/about', { title, description }) };
}