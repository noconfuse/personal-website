import type { Metadata } from 'next';
import type { Locale } from '@/config/site';
import { getSiteConfig, siteConfig } from '@/config/site';
import { localeAlternates } from '@/lib/i18n';

export function buildMetadata(locale: Locale, path: string, overrides?: { title?: string; description?: string }): Metadata {
  const config = getSiteConfig(locale);
  const alt = localeAlternates(path);
  const canonical = locale === 'en' ? alt.en : alt.zh;
  const title = overrides?.title ?? `${config.person.name} — ${config.person.role}`;
  const description = overrides?.description ?? (locale === 'en'
    ? `${config.person.name} — independent developer in Shanghai. 6 years of front-end experience, TypeScript, React, Cocos Creator, games and interactive development.`
    : `${config.person.name} 的个人作品与思考。独立开发者，6年前端研发经验，擅长 TypeScript、React、Cocos Creator、游戏互动开发。`);
  const ogLocale = locale === 'en' ? 'en_US' : 'zh_CN';

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { 'zh-CN': alt.zh, 'en': alt.en, 'x-default': alt.zh },
    },
    openGraph: { type: 'website', locale: ogLocale, url: canonical, siteName: config.brand.label, title, description, images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', site: '@noconfuse', creator: '@noconfuse', title, description, images: ['/og-image.png'] },
  };
}

export const sharedMetadataFields = {
  metadataBase: new URL(siteConfig.url),
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' as const, 'max-snippet': -1 } },
  icons: { icon: '/icon.svg', shortcut: '/favicon.ico', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
};