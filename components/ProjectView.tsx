import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getItem, getItems } from '@/lib/content';
import { getSiteConfig, type Locale } from '@/config/site';
import { buildMetadata, sharedMetadataFields } from '@/lib/metadata';
import { localePath } from '@/lib/i18n';

export function projectStaticParams(locale: Locale) {
  return getItems('project', locale).map((project) => ({ slug: project.slug }));
}

export async function projectMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const project = getItem('project', slug, locale);
  if (!project) return {};
  const config = getSiteConfig(locale);
  const base = locale === 'en' ? `${config.url}/en/projects` : `${config.url}/projects`;
  const url = `${base}/${project.slug}`;
  const projectSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: String(project.title),
    description: project.description,
    url,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY', availability: 'https://schema.org/InStock' },
    author: { '@type': 'Person', name: config.person.name, url: locale === 'en' ? `${config.url}/en` : config.url },
    datePublished: project.date,
    dateModified: project.date,
    featureList: project.tags,
    image: project.image ? `${config.url}${project.image}` : `${config.url}/og-image.png`,
  });
  const ogImage = project.image ? `${config.url}${project.image}` : `${config.url}/og-image.png`;
  return {
    ...sharedMetadataFields,
    title: String(project.title),
    description: project.description,
    openGraph: { type: 'website', url, title: String(project.title), description: project.description, images: [{ url: ogImage, width: 1200, height: 630, alt: String(project.title) }] },
    twitter: { card: 'summary_large_image', title: String(project.title), description: project.description, images: [ogImage] },
    alternates: { canonical: url, languages: { [locale === 'en' ? 'en' : 'zh-CN']: url } },
    other: { 'script:ld+json': projectSchema },
  };
}

export async function ProjectView({ locale, slug }: { locale: Locale; slug: string }) {
  const project = getItem('project', slug, locale);
  if (!project) notFound();
  const config = getSiteConfig(locale);
  const base = localePath(locale, '/projects');
  const backLabel = locale === 'en' ? '← All work' : '← 返回作品';
  const visitLabel = locale === 'en' ? 'Visit site ↗' : '访问项目 ↗';
  const githubLabel = locale === 'en' ? 'Source ↗' : '查看源码 ↗';
  const { content } = await compileMDX({ source: project.content, options: { mdxOptions: { remarkPlugins: [remarkGfm] } } });
  return <main><div className="wrap"><article className="detail project-detail"><Link className="detail-back mono" href={base}>{backLabel}</Link><header className="detail-header"><div className="detail-kicker mono">{String(project.category).toUpperCase()} / {project.date}</div><h1>{String(project.title)}</h1><p className="detail-description">{String(project.description)}</p><div className="detail-meta mono">{String(project.status)} · {project.tags.join(' · ')}</div><div className={`project-banner ${String(project.color)}${project.image ? ' has-image' : ''}`}>{project.image && <Image className="project-banner-img" src={String(project.image)} alt={String(project.title)} fill sizes="1100px" />}<span className="project-side">PROJECT / {String(project.date).slice(0, 4)}</span></div><div className="detail-links">{project.link && <a className="button primary" href={String(project.link)} target="_blank" rel="noreferrer">{visitLabel}</a>}{project.github && <a className="button" href={String(project.github)} target="_blank" rel="noreferrer">{githubLabel}</a>}</div></header><div className="prose">{content}</div></article></div></main>;
}