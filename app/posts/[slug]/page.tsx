import { notFound } from 'next/navigation';
import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getItem, getItems } from '@/lib/content';
import { siteConfig } from '@/config/site';
export function generateStaticParams() { return getItems('post').map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: { slug: string } }) { const post = getItem('post', params.slug); return post ? { title: `${String(post.title)} — ${siteConfig.person.name}`, description: post.description } : {}; }
export default async function PostPage({ params }: { params: { slug: string } }) { const post = getItem('post', params.slug); if (!post) notFound(); const { content } = await compileMDX({ source: post.content, options: { mdxOptions: { remarkPlugins: [remarkGfm] } } }); return <main><div className="wrap"><article className="detail"><Link className="detail-back mono" href="/posts">← 返回杂记</Link><header className="detail-header"><div className="detail-kicker mono">{String(post.date)} / {post.tags.join(' · ')}</div><h1>{String(post.title)}</h1><p className="detail-description">{String(post.description)}</p><div className="detail-meta mono">{String(post.readingTime)} · {siteConfig.person.name.toUpperCase()}</div></header><div className="prose">{content}</div></article></div></main>; }
