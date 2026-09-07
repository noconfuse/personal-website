import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

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

export function getItems(type: ContentType): ContentItem[] {
  const directory = path.join(root, type === 'post' ? 'posts' : 'projects');
  return fs.readdirSync(directory).filter((file) => file.endsWith('.mdx')).map((file) => {
    const parsed = matter(fs.readFileSync(path.join(directory, file), 'utf8'));
    // 分类字段是 frontmatter 里的 type（web/app/...），目录参数仅用于定位文件夹，不能覆盖它
    const { type: category, ...frontmatter } = parsed.data;
    return { ...frontmatter, date: formatDate(parsed.data.date), slug: file.replace(/\.mdx$/, ''), category: typeof category === 'string' ? category : '', tags: parsed.data.tags ?? [], readingTime: readingTime(parsed.content).text } as ContentItem;
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export function getItem(type: ContentType, slug: string) {
  const file = path.join(root, type === 'post' ? 'posts' : 'projects', `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, 'utf8');
  const parsed = matter(source);
  const { type: category, ...frontmatter } = parsed.data;
  return { ...frontmatter, date: formatDate(parsed.data.date), slug, category: typeof category === 'string' ? category : '', content: parsed.content, readingTime: readingTime(parsed.content).text, tags: parsed.data.tags ?? [] } as ContentItem & { content: string; readingTime: string };
}
