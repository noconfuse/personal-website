import { siteConfig } from '@/config/site';
export default function Ticker() { return <div className="ticker" aria-hidden="true"><div className="ticker-line">{Array.from({ length: 2 }).flatMap((_, index) => siteConfig.home.ticker.map((item, itemIndex) => <span className="ticker-item" key={`${index}-${itemIndex}`}>{item}</span>))}</div></div>; }
