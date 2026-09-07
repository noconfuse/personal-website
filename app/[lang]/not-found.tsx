import Link from 'next/link';
import { getSiteConfig } from '@/config/site';
const config = getSiteConfig('zh');
export const metadata = { title: `页面不存在 — ${config.person.name}` };
export default function NotFound() {
  return <main><div className="wrap"><div className="page-hero"><div className="eyebrow mono"><span className="eyebrow-dot" /> 404 / LOST</div><h1>这个页面<br /><em>不存在。</em></h1><p>可能是我删掉了它，或者你记错了地址。</p><div className="hero-links"><Link className="button primary" href="/">回到首页 ↗</Link><Link className="button" href="/projects">看作品 ↗</Link></div></div></div></main>;
}