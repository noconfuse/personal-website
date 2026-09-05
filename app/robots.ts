import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/', '/static/', '/*.json$'], crawlDelay: 10 },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}