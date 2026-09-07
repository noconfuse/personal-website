import { HomePage, homeMetadata } from '@/components/HomeView';
import type { Locale } from '@/config/site';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return homeMetadata(params.lang === 'en' ? 'en' : 'zh');
}

export function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default function Home({ params }: { params: { lang: string } }) {
  return <HomePage locale={params.lang === 'en' ? 'en' : 'zh'} />;
}