import Link from 'next/link';
import Image from 'next/image';
import type { ContentItem } from '@/lib/content';
export default function WorkCard({ item, index }: { item: ContentItem; index: number }) {
  const size = index % 4 === 0 ? 'large' : index % 4 === 1 ? 'small' : index % 4 === 2 ? 'medium' : 'wide';
  return <article className={`work ${size}`}><div className="work-meta mono"><span>{String(index + 1).padStart(2, '0')} / {String(item.category).toUpperCase()}</span><span>{String(item.date).slice(0, 4)}</span></div>{item.image ? <div className="work-visual-image"><Image className="work-visual-image-img" src={String(item.image)} alt={String(item.title)} fill sizes="(max-width:760px) 80vw, 45%" /></div> : index < 3 && <div className={`work-visual ${index === 1 ? 'phone' : index === 2 ? 'grid' : ''}`} />}<div className="work-bottom"><h3>{item.title}</h3><p>{item.description}</p><Link className="work-link" href={`/projects/${item.slug}`}>查看项目 ↗</Link></div></article>;
}
