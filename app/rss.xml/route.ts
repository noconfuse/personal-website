import { getItems } from '@/lib/content';
import { siteConfig } from '@/config/site';

function esc(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function GET() {
  const base = siteConfig.url;
  const posts = getItems('post');
  const items = posts.map((post) => `<item><title>${esc(post.title)}</title><link>${base}/posts/${post.slug}</link><guid>${base}/posts/${post.slug}</guid><description>${esc(post.description)}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(siteConfig.person.name)} 的杂记</title><link>${base}/posts</link><description>${esc(siteConfig.person.name)} 的个人作品与思考。</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}