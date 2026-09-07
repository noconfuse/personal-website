import Link from 'next/link';
import type { ContentItem } from '@/lib/content';
import { localePath } from '@/lib/i18n';
import type { Locale } from '@/config/site';

export default function NoteList({ items, limit, locale = 'zh' }: { items: ContentItem[]; limit?: number; locale?: Locale }) {
  const base = '';
  const readLabel = locale === 'en' ? 'read' : '阅读';
  return <div className="note-list">{items.slice(0, limit).map((item) => <Link className="note" href={localePath(locale, `/posts/${item.slug}`)} key={item.slug}><span className="note-date">{item.date}</span><div><h3>{String(item.title)}</h3><div className="note-tag">{item.tags.join(' · ')} · {readLabel} {String(item.readingTime ?? '5 min')}</div></div><span className="note-arrow">↗</span></Link>)}</div>;
}