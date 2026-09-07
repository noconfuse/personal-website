import type { Metadata } from 'next';
import Link from 'next/link';
import { getItems } from '@/lib/content';
import { getSiteConfig, type Locale } from '@/config/site';
import { buildMetadata, sharedMetadataFields } from '@/lib/metadata';
import { localePath } from '@/lib/i18n';

export function PostsView({ locale }: { locale: Locale }) {
  const config = getSiteConfig(locale);
  const posts = getItems('post', locale);
  const base = localePath(locale, '/posts');
  const t = locale === 'en'
    ? { eyebrow: 'NOTES / WRITING', title1: 'Notes &', title2: 'reflections.', sub: 'On indie development, design, life, and questions I haven\'t figured out yet.', all: 'All notes' }
    : { eyebrow: 'NOTES / WRITING', title1: '杂记与', title2: '思考。', sub: '一些关于独立开发、设计、生活，以及我还没想明白的事情。', all: '全部文章' };

  return <main><div className="wrap"><div className="page-hero"><div className="eyebrow mono"><span className="eyebrow-dot" /> {t.eyebrow}</div><h1>{t.title1}<br /><em>{t.title2}</em></h1><p>{t.sub}</p></div><section className="content-index"><div className="section-head"><span className="section-title">{t.all}</span><span className="section-count mono">{String(posts.length).padStart(2, '0')} NOTES</span></div><div className="content-list">{posts.map((post) => <Link className="content-row" href={`${base}/${post.slug}`} key={post.slug}><span className="note-date">{post.date}</span><div><h2>{post.title}</h2><p>{post.description}</p><div className="content-tags">{post.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div><span className="content-arrow">↗</span></Link>)}</div></section></div></main>;
}

export function postsMetadata(locale: Locale): Metadata {
  const config = getSiteConfig(locale);
  const description = locale === 'en'
    ? `${config.person.name}'s notes on indie development, front-end engineering, product design and life. React/Next.js, Cocos Creator, TypeScript, AI applications.`
    : `${config.person.name} 的技术随笔与思考。记录独立开发心路、前端工程实践、产品设计思考、生活感悟。主题涵盖 React/Next.js、Cocos Creator、TypeScript、产品策略、AI 应用开发等。`;
  const title = locale === 'en' ? 'Notes' : '杂记';
  return { ...sharedMetadataFields, ...buildMetadata(locale, locale === 'en' ? '/en/posts' : '/posts', { title, description }) };
}