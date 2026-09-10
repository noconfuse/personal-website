import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteConfig } from '@/config/site';
import { buildMetadata, sharedMetadataFields } from '@/lib/metadata';
import { localeAlternates } from '@/lib/i18n';
import type { Locale } from '@/config/site';

export function buildLayoutMetadata(locale: Locale): Metadata {
  const config = getSiteConfig(locale);
  const personSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.person.name,
    alternateName: locale === 'en' ? '鲍磊' : 'LuMaRen',
    url: locale === 'en' ? `${getSiteConfig(locale).url}/en` : getSiteConfig(locale).url,
    sameAs: config.social.filter(s => s.href).map(s => s.href),
    jobTitle: config.person.role,
    knowsAbout: locale === 'en'
      ? ['TypeScript', 'React', 'Next.js', 'Cocos Creator', 'WebGL', 'Indie development', 'Product design', 'Front-end architecture']
      : ['TypeScript', 'React', 'Next.js', 'Cocos Creator', 'WebGL', '独立开发', '产品设计', '前端架构'],
    description: config.person.intro,
  });

  const alt = localeAlternates('/');
  const websiteSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: locale === 'en' ? alt.en : alt.zh,
    name: config.brand.label,
    description: config.person.intro,
    author: { '@type': 'Person', name: config.person.name, url: locale === 'en' ? alt.en : alt.zh },
    inLanguage: locale === 'en' ? 'en' : 'zh-CN',
  });

  return {
    ...sharedMetadataFields,
    metadataBase: new URL(getSiteConfig(locale).url),
    title: { default: `${config.person.name} — ${config.person.role}`, template: `%s — ${config.person.name}` },
    description: locale === 'en'
      ? `${config.person.name} — independent developer in Shanghai. 10 years of development: web front-end, game front-end at Ximalaya, now indie. TypeScript, React, Vue, Cocos Creator, Electron, Tauri, AI Agent.`
      : `${config.person.name} 的个人作品与思考。独立开发者，10 年开发经验（前端 / 游戏 / 独立开发），擅长 TypeScript、React、Vue、Cocos Creator、Electron、Tauri、AI Agent。`,
    keywords: locale === 'en'
      ? ['LuMaRen', 'indie developer', 'full-stack developer', 'AI Agent', 'Cocos Creator', 'React', 'Vue', 'TypeScript', 'Electron', 'Tauri', 'portfolio', 'FateMesh', 'SpaceRoam']
      : ['鹿码人', '鲍磊', '独立开发者', '全栈开发', 'AI Agent', '前端开发', '游戏研发', 'Cocos Creator', 'React', 'Vue', 'TypeScript', 'Electron', 'Tauri', '作品集', '个人网站', 'FateMesh', 'SpaceRoam'],
    alternates: {
      canonical: locale === 'en' ? `${getSiteConfig(locale).url}/en` : getSiteConfig(locale).url,
      languages: { 'zh-CN': alt.zh, 'en': alt.en, 'x-default': alt.zh },
      types: { 'application/rss+xml': '/rss.xml' },
    },
    openGraph: { type: 'website', locale: locale === 'en' ? 'en_US' : 'zh_CN', url: locale === 'en' ? `${getSiteConfig(locale).url}/en` : getSiteConfig(locale).url, siteName: config.brand.label, title: `${config.person.name} — ${config.person.role}`, description: config.person.intro, images: [{ url: '/og-image.png', width: 1200, height: 630, alt: config.brand.label }] },
    twitter: { card: 'summary_large_image', site: '@noconfuse', creator: '@noconfuse', title: `${config.person.name} — ${config.person.role}`, description: config.person.intro, images: ['/og-image.png'] },
    other: { 'script:ld+json': [personSchema, websiteSchema] },
  };
}

/**
 * 语言外壳：只输出头部导航 + 页脚 + 悬浮窗。
 * 注意：<html>/<body> 只能由根布局渲染，嵌套路由布局绝对不能再包一层，
 * 否则会出现「<html> cannot be a child of <body>」hydration 错误。
 */
export function LocaleLayout({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const config = getSiteConfig(locale);
  const home = locale === 'en' ? '/en' : '/';
  const contactHref = locale === 'en' ? '/en#contact' : '/#contact';
  const switchHref = locale === 'en' ? '/' : '/en';
  const switchLabel = locale === 'en' ? '中文' : 'EN';

  return (
    <>
      <div className="topline"><div className="wrap"><header className="site-header">
        <Link className="brand" href={home}><span className="brand-mark" /><span>{config.brand.label}</span></Link>
        <nav className="nav">
          {config.navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          <Link className="lang-switch" href={switchHref} hrefLang={locale === 'en' ? 'zh-CN' : 'en'}>{switchLabel}</Link>
          <Link className="nav-cta" href={contactHref}>{locale === 'en' ? 'Start a project ↗' : '聊聊项目 ↗'}</Link>
        </nav>
      </header></div></div>
      {children}
      <footer><div className="wrap"><div className="footer-inner">
        <span className="mono">{config.brand.footer}</span>
        <span className="mono">{config.social.map((item) => item.href ? <a href={item.href} key={item.label}>{item.label}　</a> : <span key={item.label}>{item.label}　</span>)}</span>
      </div></div></footer>
    </>
  );
}