import type { Metadata } from 'next';
import Link from 'next/link';
import { DM_Sans, DM_Mono } from 'next/font/google';
import { siteConfig } from '@/config/site';
import './globals.css';

const sans = DM_Sans({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = DM_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = { title: { default: `${siteConfig.person.name} — ${siteConfig.person.role}`, template: `%s — ${siteConfig.person.name}` }, description: `${siteConfig.person.name} 的个人作品与思考。`, keywords: ['Paul', '独立开发者', '前端开发', '作品集', '个人网站', 'Next.js'], openGraph: { type: 'website', locale: 'zh_CN', siteName: siteConfig.brand.label, title: `${siteConfig.person.name} — ${siteConfig.person.role}`, description: `${siteConfig.person.name} 的个人作品与思考。` }, twitter: { card: 'summary_large_image', title: `${siteConfig.person.name} — ${siteConfig.person.role}`, description: `${siteConfig.person.name} 的个人作品与思考。` }, icons: { icon: '/icon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap" rel="stylesheet" /></head><body className={`${sans.variable} ${mono.variable}`}><div className="topline"><div className="wrap"><header className="site-header"><Link className="brand" href="/"><span className="brand-mark" /><span>{siteConfig.brand.label}</span></Link><nav className="nav">{siteConfig.navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}<Link className="nav-cta" href="/#contact">聊聊项目 ↗</Link></nav></header></div></div>{children}<footer><div className="wrap"><div className="footer-inner"><span className="mono">{siteConfig.brand.footer}</span><span className="mono">{siteConfig.social.map((item) => item.href ? <a href={item.href} key={item.label}>{item.label}　</a> : <span key={item.label}>{item.label}　</span>)}</span></div></div></footer></body></html>;
}
