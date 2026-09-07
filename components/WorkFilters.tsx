'use client';
import { useState } from 'react';
import type { ContentItem } from '@/lib/content';
import WorkCard from './WorkCard';
import type { Locale } from '@/config/site';
export default function WorkFilters({ items, locale = 'zh' }: { items: ContentItem[]; locale?: Locale }) { const [filter, setFilter] = useState('all'); const filters = locale === 'en' ? [['all', 'All'], ['ai', 'AI Product'], ['tool', 'Tools']] : [['all', '全部'], ['ai', 'AI 产品'], ['tool', '工具']]; const visible = items.filter((item) => filter === 'all' || item.category === filter); return <><div className="filters">{filters.map(([value, label]) => <button className={`filter ${filter === value ? 'selected' : ''}`} key={value} onClick={() => setFilter(value)}>{label}</button>)}</div><div className="work-grid" style={{ marginTop: 20 }}>{visible.map((item, index) => <WorkCard item={item} index={index} key={item.slug} locale={locale} />)}</div></>; }
