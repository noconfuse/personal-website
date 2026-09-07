import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Locale } from '@/config/site';

/** 内容缓存：dev 模式与运行时避免每次渲染重复读文件 + 解析 frontmatter */
const itemCache = new Map<string, unknown>();
const listCache = new Map<string, ContentItem[]>();

export type ContentType = 'post' | 'project';
export type ContentItem = { slug: string; category: string; title: string; description: string; date: string; tags: string[]; image?: string; link?: string; github?: string; readingTime?: string; [key: string]: unknown };
const root = path.join(process.cwd(), 'content');

function formatDate(value: unknown): string {
  if (value instanceof Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  }
  return String(value ?? '').slice(0, 10);
}

function dirFor(type: ContentType, locale: Locale): string {
  return path.join(root, locale === 'en' ? 'en' : '', type === 'post' ? 'posts' : 'projects');
}

export function getItems(type: ContentType, locale: Locale = 'zh'): ContentItem[] {
  const directory = dirFor(type, locale);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter((file) => file.endsWith('.mdx')).map((file) => {
    const parsed = matter(fs.readFileSync(path.join(directory, file), 'utf8'));
    // 分类字段是 frontmatter 里的 type（ai/tool/...），目录参数仅用于定位文件夹，不能覆盖它
    const { type: category, ...frontmatter } = parsed.data;
    return { ...frontmatter, date: formatDate(parsed.data.date), slug: file.replace(/\.mdx$/, ''), category: typeof category === 'string' ? category : '', tags: parsed.data.tags ?? [], readingTime: readingTime(parsed.content).text } as ContentItem;
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export function getItem(type: ContentType, slug: string, locale: Locale = 'zh') {
  const cacheKey = `${locale}:${type}:${slug}`;
  const cached = itemCache.get(cacheKey);
  if (cached) return cached as ContentItem & { content: string; readingTime: string };
  const file = path.join(dirFor(type, locale), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, 'utf8');
  const parsed = matter(source);
  const { type: category, ...frontmatter } = parsed.data;
  const item = { ...frontmatter, date: formatDate(parsed.data.date), slug, category: typeof category === 'string' ? category : '', content: parsed.content, readingTime: readingTime(parsed.content).text, tags: parsed.data.tags ?? [] } as ContentItem & { content: string; readingTime: string };
  itemCache.set(cacheKey, item);
  return item;
}