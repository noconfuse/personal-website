import type { MetadataRoute } from 'next';
import { getItems } from '@/lib/content';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();
  const statics = [
    { url: base, lastModified: now, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${base}/posts`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
  ];
  const projects = getItems('project').map((item) => ({ url: `${base}/projects/${item.slug}`, lastModified: new Date(item.date), changeFrequency: 'monthly' as const, priority: 0.8 }));
  const posts = getItems('post').map((item) => ({ url: `${base}/posts/${item.slug}`, lastModified: new Date(item.date), changeFrequency: 'monthly' as const, priority: 0.7 }));
  return [...statics, ...projects, ...posts];
}