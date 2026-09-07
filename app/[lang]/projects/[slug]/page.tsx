import { notFound } from 'next/navigation';
import { ProjectView, projectMetadata, projectStaticParams } from '@/components/ProjectView';

export function generateStaticParams() {
  return [...projectStaticParams('zh'), ...projectStaticParams('en')];
}

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }) {
  return projectMetadata(params.lang === 'en' ? 'en' : 'zh', params.slug);
}

export default async function ProjectPage({ params }: { params: { lang: string; slug: string } }) {
  const lang = params.lang === 'en' ? 'en' : 'zh';
  const item = (await import('@/lib/content')).getItem('project', params.slug, lang);
  if (!item) notFound();
  return <ProjectView locale={lang} slug={params.slug} />;
}