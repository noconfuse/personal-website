import { ProjectsView, projectsMetadata } from '@/components/ProjectsView';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return projectsMetadata(params.lang === 'en' ? 'en' : 'zh');
}

export default function ProjectsPage({ params }: { params: { lang: string } }) {
  return <ProjectsView locale={params.lang === 'en' ? 'en' : 'zh'} />;
}