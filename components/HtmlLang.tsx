'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** 根布局是静态的 lang="zh-CN"；/en 路由的 lang 由这里在客户端/路由切换时修正 */
export default function HtmlLang() {
  const pathname = usePathname();
  useEffect(() => {
    const lang = pathname.startsWith('/en') ? 'en' : 'zh-CN';
    document.documentElement.lang = lang;
  }, [pathname]);
  return null;
}
