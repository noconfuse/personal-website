import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getItem, getItems } from '@/lib/content';
import { getSiteConfig, type Locale } from '@/config/site';
import { sharedMetadataFields } from '@/lib/metadata';
import { localePath } from '@/lib/i18n';

export function postStaticParams(locale: Locale) {
  return getItems('post', locale).map((post) => ({ slug: post.slug }));
}

export async function postMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const post = getItem('post', slug, locale);
  if (!post) return {};
  const config = getSiteConfig(locale);
  const base = locale === 'en' ? `${config.url}/en/posts` : `${config.url}/posts`;
  const url = `${base}/${post.slug}`;
  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: String(post.title),
    description: post.description,
    url,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: config.person.name, url: locale === 'en' ? `${config.url}/en` : config.url },
    publisher: { '@type': 'Person', name: config.person.name },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.tags.join(', '),
    image: `${config.url}/og-image.png`,
    inLanguage: locale === 'en' ? 'en' : 'zh-CN',
  });
  return {
    ...sharedMetadataFields,
    title: String(post.title),
    description: post.description,
    openGraph: { type: 'article', url, title: String(post.title), description: post.description, publishedTime: post.date, authors: [config.person.name], tags: post.tags, images: [{ url: `${config.url}/og-image.png`, width: 1200, height: 630, alt: String(post.title) }] },
    twitter: { card: 'summary_large_image', title: String(post.title), description: post.description, images: [`${config.url}/og-image.png`] },
    alternates: { canonical: url, languages: { [locale === 'en' ? 'en' : 'zh-CN']: url } },
    other: { 'script:ld+json': articleSchema },
  };
}

export async function PostView({ locale, slug }: { locale: Locale; slug: string }) {
  const post = getItem('post', slug, locale);
  if (!post) notFound();
  const config = getSiteConfig(locale);
  const base = localePath(locale, '/posts');
  const backLabel = locale === 'en' ? '← All notes' : '← 返回杂记';
  const { content } = await compileMDX({ source: post.content, options: { mdxOptions: { remarkPlugins: [remarkGfm] } } });
  return <main><div className="wrap"><article className="detail"><Link className="detail-back mono" href={base}>{backLabel}</Link><header className="detail-header"><div className="detail-kicker mono">{String(post.date)} / {post.tags.join(' · ')}</div><h1>{String(post.title)}</h1><p className="detail-description">{String(post.description)}</p><div className="detail-meta mono">{String(post.readingTime)} · {config.person.name.toUpperCase()}</div></header><div className="prose">{content}</div></article></div></main>;
}