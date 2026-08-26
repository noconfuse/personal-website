'use client';
import { useState } from 'react';
import type { ContentItem } from '@/lib/content';
import WorkCard from './WorkCard';
export default function WorkFilters({ items }: { items: ContentItem[] }) { const [filter, setFilter] = useState('all'); const filters = [['all', '全部'], ['web', '网站'], ['app', 'App / 工具']]; const visible = items.filter((item) => filter === 'all' || item.type === filter); return <><div className="filters">{filters.map(([value, label]) => <button className={`filter ${filter === value ? 'selected' : ''}`} key={value} onClick={() => setFilter(value)}>{label}</button>)}</div><div className="work-grid" style={{ marginTop: 20 }}>{visible.map((item, index) => <WorkCard item={item} index={index} key={item.slug} />)}</div></>; }
