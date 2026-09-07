import { AboutView, aboutMetadata } from '@/components/AboutView';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return aboutMetadata(params.lang === 'en' ? 'en' : 'zh');
}

export default function AboutPage({ params }: { params: { lang: string } }) {
  return <AboutView locale={params.lang === 'en' ? 'en' : 'zh'} />;
}