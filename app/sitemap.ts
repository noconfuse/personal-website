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
    { url: `${base}/en`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${base}/en/projects`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${base}/en/posts`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${base}/en/about`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
  ];
  const projects = getItems('project', 'zh').map((item) => ({ url: `${base}/projects/${item.slug}`, lastModified: new Date(item.date), changeFrequency: 'monthly' as const, priority: 0.8 }));
  const posts = getItems('post', 'zh').map((item) => ({ url: `${base}/posts/${item.slug}`, lastModified: new Date(item.date), changeFrequency: 'monthly' as const, priority: 0.7 }));
  const enProjects = getItems('project', 'en').map((item) => ({ url: `${base}/en/projects/${item.slug}`, lastModified: new Date(item.date), changeFrequency: 'monthly' as const, priority: 0.7 }));
  const enPosts = getItems('post', 'en').map((item) => ({ url: `${base}/en/posts/${item.slug}`, lastModified: new Date(item.date), changeFrequency: 'monthly' as const, priority: 0.6 }));
  return [...statics, ...projects, ...posts, ...enProjects, ...enPosts];
}