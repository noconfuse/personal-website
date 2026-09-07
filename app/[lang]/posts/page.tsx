import { PostsView, postsMetadata } from '@/components/PostsView';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return postsMetadata(params.lang === 'en' ? 'en' : 'zh');
}

export default function PostsPage({ params }: { params: { lang: string } }) {
  return <PostsView locale={params.lang === 'en' ? 'en' : 'zh'} />;
}