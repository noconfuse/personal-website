import type { Metadata } from 'next';
import Link from 'next/link';
import { DM_Sans, DM_Mono } from 'next/font/google';
import { siteConfig } from '@/config/site';
import './globals.css';

const sans = DM_Sans({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = DM_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const personSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.person.name,
  url: siteConfig.url,
  sameAs: siteConfig.social.filter(s => s.href).map(s => s.href),
  jobTitle: siteConfig.person.role,
  worksFor: {
    '@type': 'Organization',
    name: '自由职业',
  },
  knowsAbout: ['TypeScript', 'React', 'Next.js', 'Cocos Creator', 'WebGL', '独立开发', '产品设计', '前端架构'],
  description: siteConfig.person.intro,
});

const websiteSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: siteConfig.url,
  name: siteConfig.brand.label,
  description: `${siteConfig.person.name} 的个人作品与思考。`,
  author: {
    '@type': 'Person',
    name: siteConfig.person.name,
    url: siteConfig.url,
  },
  inLanguage: 'zh-CN',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${siteConfig.url}/posts?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.person.name} — ${siteConfig.person.role}`, template: `%s — ${siteConfig.person.name}` },
  description: `${siteConfig.person.name} 的个人作品与思考。独立开发者，6年前端研发经验，擅长 TypeScript、React、Cocos Creator、游戏互动开发。`,
  keywords: ['鲍磊', 'Paul', '独立开发者', '前端开发', '游戏研发', 'Cocos Creator', 'React', 'Next.js', 'TypeScript', '作品集', '个人网站', 'FateMesh', 'SpaceRoam'],
  authors: [{ name: siteConfig.person.name, url: siteConfig.url }],
  creator: siteConfig.person.name,
  publisher: siteConfig.person.name,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: { type: 'website', locale: 'zh_CN', url: siteConfig.url, siteName: siteConfig.brand.label, title: `${siteConfig.person.name} — ${siteConfig.person.role}`, description: `${siteConfig.person.name} 的个人作品与思考。`, images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${siteConfig.person.name} — 独立开发者` }] },
  twitter: { card: 'summary_large_image', site: '@noconfuse', creator: '@noconfuse', title: `${siteConfig.person.name} — ${siteConfig.person.role}`, description: `${siteConfig.person.name} 的个人作品与思考。`, images: ['/og-image.png'] },
  icons: { icon: '/icon.svg', shortcut: '/favicon.ico', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
  alternates: { canonical: siteConfig.url, types: { 'application/rss+xml': '/rss.xml' } },
  verification: { google: '', yandex: '' },
  other: { 'script:ld+json': [personSchema, websiteSchema] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap" rel="stylesheet" /></head><body className={`${sans.variable} ${mono.variable}`}><div className="topline"><div className="wrap"><header className="site-header"><Link className="brand" href="/"><span className="brand-mark" /><span>{siteConfig.brand.label}</span></Link><nav className="nav">{siteConfig.navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}<Link className="nav-cta" href="/#contact">聊聊项目 ↗</Link></nav></header></div></div>{children}<footer><div className="wrap"><div className="footer-inner"><span className="mono">{siteConfig.brand.footer}</span><span className="mono">{siteConfig.social.map((item) => item.href ? <a href={item.href} key={item.label}>{item.label}　</a> : <span key={item.label}>{item.label}　</span>)}</span></div></div></footer></body></html>;
}
