import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export type ContentType = 'post' | 'project';
export type ContentItem = { slug: string; type: ContentType; title: string; description: string; date: string; tags: string[]; image?: string; link?: string; github?: string; readingTime?: string; [key: string]: unknown };
const root = path.join(process.cwd(), 'content');

export function getItems(type: ContentType): ContentItem[] {
  const directory = path.join(root, type === 'post' ? 'posts' : 'projects');
  return fs.readdirSync(directory).filter((file) => file.endsWith('.mdx')).map((file) => {
    const parsed = matter(fs.readFileSync(path.join(directory, file), 'utf8'));
    return { ...parsed.data, date: String(parsed.data.date), slug: file.replace(/\.mdx$/, ''), type, tags: parsed.data.tags ?? [], readingTime: readingTime(parsed.content).text } as ContentItem;
  }).sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function getItem(type: ContentType, slug: string) {
  const file = path.join(root, type === 'post' ? 'posts' : 'projects', `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, 'utf8');
  const parsed = matter(source);
  return { ...parsed.data, date: String(parsed.data.date), slug, type, content: parsed.content, readingTime: readingTime(parsed.content).text, tags: parsed.data.tags ?? [] } as ContentItem & { content: string; readingTime: string };
}
