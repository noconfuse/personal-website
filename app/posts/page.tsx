import type { Metadata } from 'next';
import Link from 'next/link';
import { getItems } from '@/lib/content';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: '杂记',
  description: `${siteConfig.person.name} 的技术随笔与思考。记录独立开发心路、前端工程实践、产品设计思考、生活感悟。主题涵盖 React/Next.js、Cocos Creator、TypeScript、产品策略、AI 应用开发等。`,
  openGraph: { title: `杂记 — ${siteConfig.person.name}`, description: `${siteConfig.person.name} 的技术随笔与思考。`, images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: `杂记 — ${siteConfig.person.name}`, description: `${siteConfig.person.name} 的技术随笔与思考。`, images: ['/og-image.png'] },
  alternates: { canonical: `${siteConfig.url}/posts` },
};

export default function PostsPage() { const posts = getItems('post'); return <main><div className="wrap"><div className="page-hero"><div className="eyebrow mono"><span className="eyebrow-dot" /> NOTES / WRITING</div><h1>杂记与<br /><em>思考。</em></h1><p>一些关于独立开发、设计、生活，以及我还没想明白的事情。</p></div><section className="content-index"><div className="section-head"><span className="section-title">全部文章</span><span className="section-count mono">{String(posts.length).padStart(2, '0')} NOTES</span></div><div className="content-list">{posts.map((post) => <Link className="content-row" href={`/posts/${post.slug}`} key={post.slug}><span className="note-date">{post.date}</span><div><h2>{post.title}</h2><p>{post.description}</p><div className="content-tags">{post.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div><span className="content-arrow">↗</span></Link>)}</div></section></div></main>; }
