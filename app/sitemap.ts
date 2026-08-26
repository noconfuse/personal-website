import type { MetadataRoute } from 'next';
import { getItems } from '@/lib/content';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();
  const statics = ['', '/projects', '/posts', '/about'].map((path) => ({ url: `${base}${path}`, lastModified: now }));
  const projects = getItems('project').map((item) => ({ url: `${base}/projects/${item.slug}`, lastModified: new Date(item.date) }));
  const posts = getItems('post').map((item) => ({ url: `${base}/posts/${item.slug}`, lastModified: new Date(item.date) }));
  return [...statics, ...projects, ...posts];
}