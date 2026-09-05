import { getItems } from '@/lib/content';
import { siteConfig } from '@/config/site';

function esc(value: string) {
  return value.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
}

export function GET() {
  const base = siteConfig.url;
  const posts = getItems('post');
  const items = posts.map((post) => `
    <item>
      <title>${esc(post.title)}</title>
      <link>${base}/posts/${post.slug}</link>
      <guid isPermaLink="true">${base}/posts/${post.slug}</guid>
      <description>${esc(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${esc(siteConfig.person.email)} (${esc(siteConfig.person.name)})</author>
      <category>${esc(post.tags.join('</category><category>'))}</category>
    </item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${esc(siteConfig.person.name)} 的杂记</title>
    <link>${base}/posts</link>
    <description>${esc(siteConfig.person.name)} 的个人作品与思考。独立开发、前端工程、产品设计、生活感悟。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />
    <managingEditor>${esc(siteConfig.person.email)} (${esc(siteConfig.person.name)})</managingEditor>
    <webMaster>${esc(siteConfig.person.email)} (${esc(siteConfig.person.name)})</webMaster>
    <ttl>60</ttl>
    ${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' } });
}