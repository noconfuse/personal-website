import type { Metadata } from 'next';
import Link from 'next/link';
import { getItems } from '@/lib/content';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: '作品',
  description: `${siteConfig.person.name} 的精选作品集。包含 FateMesh（AI 命理智能体平台）、SpaceRoam（3D 模型漫游工具）等独立产品，以及客户定制开发项目。涵盖 React/Next.js、Cocos Creator、WebGL、TypeScript 等技术栈。`,
  openGraph: { title: `作品集 — ${siteConfig.person.name}`, description: `${siteConfig.person.name} 的精选作品集。`, images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: `作品集 — ${siteConfig.person.name}`, description: `${siteConfig.person.name} 的精选作品集。`, images: ['/og-image.png'] },
  alternates: { canonical: `${siteConfig.url}/projects` },
};

export default function ProjectsPage() { const projects = getItems('project'); return <main><div className="wrap"><div className="page-hero"><div className="eyebrow mono"><span className="eyebrow-dot" /> PROJECTS / THINGS I MADE</div><h1>做过一些<br /><em>有用的东西。</em></h1><p>产品、网站、实验和那些还在持续生长的想法。</p></div><section className="content-index"><div className="section-head"><span className="section-title">全部作品</span><span className="section-count mono">{String(projects.length).padStart(2, '0')} PROJECTS</span></div><div className="content-list">{projects.map((project) => <Link className="content-row" href={`/projects/${project.slug}`} key={project.slug}><span className="note-date">{String(project.date).slice(0, 4)}<br />{String(project.category).toUpperCase()}</span><div><h2>{project.title}</h2><p>{project.description}</p><div className="content-tags">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div><span className="content-arrow">↗</span></Link>)}</div></section></div></main>; }
