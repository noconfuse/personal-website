import { notFound } from 'next/navigation';
import { PostView, postMetadata, postStaticParams } from '@/components/PostView';

export function generateStaticParams() {
  return [...postStaticParams('zh'), ...postStaticParams('en')];
}


export async function generateMetadata({ params }: { params: { lang: string; slug: string } }) {
  return postMetadata(params.lang === 'en' ? 'en' : 'zh', params.slug);
}

export default async function PostPage({ params }: { params: { lang: string; slug: string } }) {
  const lang = params.lang === 'en' ? 'en' : 'zh';
  const item = (await import('@/lib/content')).getItem('post', params.slug, lang);
  if (!item) notFound();
  return <PostView locale={lang} slug={params.slug} />;
}