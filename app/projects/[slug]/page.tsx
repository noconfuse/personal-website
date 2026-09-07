import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getItem, getItems } from '@/lib/content';
import { siteConfig } from '@/config/site';

export function generateStaticParams() { return getItems('project').map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = getItem('project', params.slug);
  if (!project) return {};
  const url = `${siteConfig.url}/projects/${project.slug}`;
  const projectSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: String(project.title),
    description: project.description,
    url,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY', availability: 'https://schema.org/InStock' },
    author: { '@type': 'Person', name: siteConfig.person.name, url: siteConfig.url },
    datePublished: project.date,
    dateModified: project.date,
    featureList: project.tags,
    image: project.image ? `${siteConfig.url}${project.image}` : `${siteConfig.url}/og-image.png`,
  });
  return {
    title: String(project.title),
    description: project.description,
    openGraph: { type: 'website', url, title: String(project.title), description: project.description, images: [{ url: project.image ? `${siteConfig.url}${project.image}` : `${siteConfig.url}/og-image.png`, width: 1200, height: 630, alt: String(project.title) }] },
    twitter: { card: 'summary_large_image', title: String(project.title), description: project.description, images: [project.image ? `${siteConfig.url}${project.image}` : `${siteConfig.url}/og-image.png`] },
    alternates: { canonical: url },
    other: { 'script:ld+json': projectSchema },
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) { const project = getItem('project', params.slug); if (!project) notFound(); const { content } = await compileMDX({ source: project.content, options: { mdxOptions: { remarkPlugins: [remarkGfm] } } }); return <main><div className="wrap"><article className="detail project-detail"><Link className="detail-back mono" href="/projects">← 返回作品</Link><header className="detail-header"><div className="detail-kicker mono">{String(project.category).toUpperCase()} / {project.date}</div><h1>{String(project.title)}</h1><p className="detail-description">{String(project.description)}</p><div className="detail-meta mono">{String(project.status)} · {project.tags.join(' · ')}</div><div className={`project-banner ${String(project.color)}${project.image ? ' has-image' : ''}`}>{project.image && <Image className="project-banner-img" src={String(project.image)} alt={String(project.title)} fill sizes="1100px" />}<span className="project-side">PROJECT / {String(project.date).slice(0, 4)}</span></div><div className="detail-links">{project.link && <a className="button primary" href={String(project.link)} target="_blank" rel="noreferrer">访问项目 ↗</a>}{project.github && <a className="button" href={String(project.github)} target="_blank" rel="noreferrer">查看源码 ↗</a>}</div></header><div className="prose">{content}</div></article></div></main>; }
