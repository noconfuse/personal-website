import type { Metadata } from 'next';
import { DM_Sans, DM_Mono } from 'next/font/google';
import { getSiteConfig, type Locale } from '@/config/site';
import TranslationGuard from '@/components/TranslationGuard';
import AiChatWidget from '@/components/AiChatWidget';
import { localeAlternates } from '@/lib/i18n';
import { buildLayoutMetadata } from '@/lib/locale-layout';
import '../globals.css';

const sans = DM_Sans({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = DM_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export function generateStaticParams(): { lang: Locale }[] {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  return buildLayoutMetadata(params.lang === 'en' ? 'en' : 'zh');
}

export default function LangLayout({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) {
  const locale: Locale = params.lang === 'en' ? 'en' : 'zh';
  const config = getSiteConfig(locale);
  const home = locale === 'en' ? '/en' : '/';
  const contactHref = locale === 'en' ? '/en#contact' : '/#contact';
  const switchHref = locale === 'en' ? '/' : '/en';
  const switchLabel = locale === 'en' ? '中文' : 'EN';
  const alt = localeAlternates('/');

  return (
    <html lang={locale === 'en' ? 'en' : 'zh-CN'} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="alternate" hrefLang="zh-CN" href={alt.zh} />
        <link rel="alternate" hrefLang="en" href={alt.en} />
        <link rel="alternate" hrefLang="x-default" href={alt.zh} />
      </head>
      <body className={`${sans.variable} ${mono.variable}`}>
        <TranslationGuard />
        <div className="topline"><div className="wrap"><header className="site-header">
          <a className="brand" href={home}><span className="brand-mark" /><span>{config.brand.label}</span></a>
          <nav className="nav">
            {config.navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
            <a className="lang-switch" href={switchHref} hrefLang={locale === 'en' ? 'zh-CN' : 'en'}>{switchLabel}</a>
            <a className="nav-cta" href={contactHref}>{locale === 'en' ? 'Start a project ↗' : '聊聊项目 ↗'}</a>
          </nav>
        </header></div></div>
        {children}
        <AiChatWidget locale={locale} />
        <footer><div className="wrap"><div className="footer-inner">
          <span className="mono">{config.brand.footer}</span>
          <span className="mono">{config.social.map((item) => item.href ? <a href={item.href} key={item.label}>{item.label}　</a> : <span key={item.label}>{item.label}　</span>)}</span>
        </div></div></footer>
      </body>
    </html>
  );
}