import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const items = [
  'Spedizione Gratuita Sopra €50',
  'Tessuto Sculpt-Fit Brevettato',
  'Pagamenti Sicuri',
  'Reso Gratuito 30 Giorni',
  'Nuova Collezione 2025',
  'Push-Up Effect Garantito',
  'Assistenza 24/7',
  'Made with ♥ for Queens',
];

export default function Ticker({ variant = 'dark' }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const totalWidth = track.scrollWidth / 2;

    gsap.to(track, {
      x: -totalWidth,
      duration: 30,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  const bg = variant === 'coral' ? 'var(--coral)' : 'var(--dark-2)';
  const color = variant === 'coral' ? 'var(--white)' : 'var(--white-dim)';

  return (
    <div style={{
      overflow: 'hidden',
      background: bg,
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '13px 0',
    }}>
      <div ref={trackRef} style={{
        display: 'flex', gap: 0,
        whiteSpace: 'nowrap',
        willChange: 'transform',
      }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color,
            padding: '0 32px',
            fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 32,
          }}>
            {item}
            <span style={{ color: variant === 'coral' ? 'rgba(255,255,255,0.4)' : 'var(--coral)', fontSize: 8 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
