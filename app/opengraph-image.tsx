import { ImageResponse } from 'next/og';

export const alt = 'Paul — 独立开发者';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#171717', padding: 80, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 34 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#c4f04c', border: '3px solid #171717' }} />
        <div style={{ color: '#6c6a63', fontSize: 24, letterSpacing: 5 }}>MAKE / NOTICE / REPEAT</div>
      </div>
      <div style={{ color: '#c4f04c', fontSize: 150, fontWeight: 700, letterSpacing: -10, lineHeight: 1 }}>PAUL</div>
      <div style={{ color: '#eeece5', fontSize: 32, letterSpacing: 3, marginTop: 18 }}>INDEPENDENT DEVELOPER · SHANGHAI</div>
    </div>,
    size,
  );
}