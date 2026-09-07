import type { Locale } from '@/config/site';
import { siteConfig } from '@/config/site';

export const locales: Locale[] = ['zh', 'en'];

/** 生成带语言前缀的内部路径：zh → /projects/x，en → /en/projects/x */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === 'en' ? `/en${clean === '/' ? '' : clean}` : clean;
}

/** hreflang 备选链接：中文在根路径，英文在 /en */
export function localeAlternates(path: string): { zh: string; en: string } {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return {
    zh: `${siteConfig.url}${clean || '/'}`,
    en: `${siteConfig.url}/en${clean || '/'}`,
  };
}
