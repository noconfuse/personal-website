import type { Metadata } from 'next';
import Link from 'next/link';
import { getItems } from '@/lib/content';
import { getSiteConfig, type Locale } from '@/config/site';
import { buildMetadata, sharedMetadataFields } from '@/lib/metadata';
import { localePath } from '@/lib/i18n';

export function ProjectsView({ locale }: { locale: Locale }) {
  const config = getSiteConfig(locale);
  const projects = getItems('project', locale);
  const base = localePath(locale, '/projects');
  const t = locale === 'en'
    ? { eyebrow: 'PROJECTS / THINGS I MADE', title: ['Things I made', 'that are actually useful.'], sub: 'Products, websites, experiments, and ideas still growing.' , all: 'All projects' }
    : { eyebrow: 'PROJECTS / THINGS I MADE', title: ['做过一些', '有用的东西。'], sub: '产品、网站、实验和那些还在持续生长的想法。', all: '全部作品' };
  const [t1, t2] = t.title;

  return <main><div className="wrap"><div className="page-hero"><div className="eyebrow mono"><span className="eyebrow-dot" /> {t.eyebrow}</div><h1>{t1}<br /><em>{t2}</em></h1><p>{t.sub}</p></div><section className="content-index"><div className="section-head"><span className="section-title">{t.all}</span><span className="section-count mono">{String(projects.length).padStart(2, '0')} PROJECTS</span></div><div className="content-list">{projects.map((project) => <Link className="content-row" href={`${base}/${project.slug}`} key={project.slug}><span className="note-date">{String(project.date).slice(0, 4)}<br />{String(project.category).toUpperCase()}</span><div><h2>{project.title}</h2><p>{project.description}</p><div className="content-tags">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div><span className="content-arrow">↗</span></Link>)}</div></section></div></main>;
}

export function projectsMetadata(locale: Locale): Metadata {
  const config = getSiteConfig(locale);
  const description = locale === 'en'
    ? `${config.person.name}'s selected work. FateMesh (AI divination agent platform), SpaceRoam (3D roaming tool), Toolkit and more. React/Next.js, Cocos Creator, WebGL, TypeScript.`
    : `${config.person.name} 的精选作品集。包含 FateMesh（AI 命理智能体平台）、SpaceRoam（3D 模型漫游工具）等独立产品，以及客户定制开发项目。涵盖 React/Next.js、Cocos Creator、WebGL、TypeScript 等技术栈。`;
  const title = locale === 'en' ? 'Work' : '作品';
  return { ...sharedMetadataFields, ...buildMetadata(locale, locale === 'en' ? '/en/projects' : '/projects', { title, description }) };
}