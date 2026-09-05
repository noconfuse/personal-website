import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getItem, getItems } from '@/lib/content';
import { siteConfig } from '@/config/site';

export function generateStaticParams() { return getItems('post').map((post) => ({ slug: post.slug })); }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getItem('post', params.slug);
  if (!post) return {};
  const url = `${siteConfig.url}/posts/${post.slug}`;
  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: String(post.title),
    description: post.description,
    url,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: siteConfig.person.name, url: siteConfig.url },
    publisher: { '@type': 'Person', name: siteConfig.person.name },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.tags.join(', '),
    image: `${siteConfig.url}/og-image.png`,
    inLanguage: 'zh-CN',
  });
  return {
    title: String(post.title),
    description: post.description,
    openGraph: { type: 'article', url, title: String(post.title), description: post.description, publishedTime: post.date, authors: [siteConfig.person.name], tags: post.tags, images: [{ url: `${siteConfig.url}/og-image.png`, width: 1200, height: 630, alt: String(post.title) }] },
    twitter: { card: 'summary_large_image', title: String(post.title), description: post.description, images: [`${siteConfig.url}/og-image.png`] },
    alternates: { canonical: url },
    other: { 'script:ld+json': articleSchema },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) { const post = getItem('post', params.slug); if (!post) notFound(); const { content } = await compileMDX({ source: post.content, options: { mdxOptions: { remarkPlugins: [remarkGfm] } } }); return <main><div className="wrap"><article className="detail"><Link className="detail-back mono" href="/posts">← 返回杂记</Link><header className="detail-header"><div className="detail-kicker mono">{String(post.date)} / {post.tags.join(' · ')}</div><h1>{String(post.title)}</h1><p className="detail-description">{String(post.description)}</p><div className="detail-meta mono">{String(post.readingTime)} · {siteConfig.person.name.toUpperCase()}</div></header><div className="prose">{content}</div></article></div></main>; }
