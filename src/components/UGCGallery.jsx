import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ugcImages } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

const handles = [
  '@sofia.fitness', '@giulia.workout', '@vale_active',
  '@ale.sportiva', '@marti.moves', '@chiara.fit',
  '@erica.active', '@laura.queen',
];

export default function UGCGallery() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      }
    );

    const items = gridRef.current.children;
    gsap.fromTo(items,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1, opacity: 1, stagger: 0.07,
        duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 85%' }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} style={{
      padding: '100px 0 80px',
      background: 'var(--dark)',
    }}>
      <div className="container">
        <div ref={headerRef} style={{
          textAlign: 'center',
          marginBottom: 52,
        }}>
          <div style={{
            fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--coral)', marginBottom: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <div style={{ width: 24, height: 1, background: 'var(--coral)' }} />
            Community
            <div style={{ width: 24, height: 1, background: 'var(--coral)' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 6vw, 80px)',
            lineHeight: 0.9,
          }}>
            #NISHA<span style={{ color: 'var(--coral)' }}>QUEENS</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--white-dim)', marginTop: 16, fontWeight: 300 }}>
            Taggaci su Instagram e diventa parte della nostra community
          </p>
        </div>

        {/* Instagram grid */}
        <div ref={gridRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}>
          {ugcImages.map((img, i) => (
            <UGCItem key={i} img={img} handle={handles[i]} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a
            href="https://instagram.com/nishaactivewear"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--white)',
              padding: '14px 32px',
              border: '1px solid var(--border)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--white)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
            Seguici su Instagram
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div > div:nth-child(3) { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

function UGCItem({ img, handle, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        aspectRatio: '1',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <img
        src={img}
        alt={handle}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s var(--ease)',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(26,20,16,0.65)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 8,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="1" fill="white"/>
        </svg>
        <span style={{ fontSize: 12, color: 'var(--white)', fontWeight: 500 }}>{handle}</span>
      </div>
    </div>
  );
}

import { useState } from 'react';
