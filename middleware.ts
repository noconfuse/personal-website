import { NextRequest, NextResponse } from 'next/server';

/**
 * 中文保持根路径（/ /projects /posts /about），内部 rewrite 到 /zh 前缀；
 * 英文使用 /en 前缀（内部一致）。浏览器 URL 不变。
 */
const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过 API、静态文件、已带语言前缀的路径
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/zh') ||
    pathname.startsWith('/en') ||
    pathname.startsWith('/_next') ||
    pathname === '/rss.xml' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const trimmed = pathname === '/' ? '' : pathname;
  url.pathname = `/zh${trimmed}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // 排除常见静态资源
  matcher: ['/((?!_next|favicon.ico|icon.svg|og-image.png|site.webmanifest|apple-touch-icon.png|robots.txt|sitemap.xml|rss.xml|api/|.*\\..*$).*)']
};