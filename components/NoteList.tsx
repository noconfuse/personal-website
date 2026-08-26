import Link from 'next/link';
import type { ContentItem } from '@/lib/content';
export default function NoteList({ items, limit }: { items: ContentItem[]; limit?: number }) { return <div className="note-list">{items.slice(0, limit).map((item) => <Link className="note" href={`/posts/${item.slug}`} key={item.slug}><span className="note-date">{item.date}</span><div><h3>{String(item.title)}</h3><div className="note-tag">{item.tags.join(' · ')} · 阅读 {String(item.readingTime ?? '5 min')}</div></div><span className="note-arrow">↗</span></Link>)}</div>; }
