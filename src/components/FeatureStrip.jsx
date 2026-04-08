import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=85',
    label: '01 — Sculpt Fit',
    title: 'MODELLA\nIL TUO\nCORPO',
    body: 'Il nostro tessuto sculpt-fit a compressione progressiva ridisegna la silhouette e sostiene ogni movimento.',
    tag: 'TECNOLOGIA',
  },
  {
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85',
    label: '02 — Performance',
    title: 'ZERO\nLIMITI,\nZERO SCUSE',
    body: 'Tessuti tecnici che si adattano, respirano e resistono a ogni tipo di allenamento, dalla palestra allo yoga.',
    tag: 'PERFORMANCE',
  },
  {
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85',
    label: '03 — Style',
    title: 'SPORT\nMEETS\nSTILE',
    body: 'Palette di colori curata stagione per stagione. Dal gym alla strada, sempre impeccabile.',
    tag: 'DESIGN',
  },
];

export default function FeatureStrip() {
  const sectionRef = useRef(null);
  const panelsRef = useRef([]);
  const imgsRef = useRef([]);
  const textsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      panelsRef.current.forEach((panel, i) => {
        const img = imgsRef.current[i];
        const text = textsRef.current[i];

        // Image reveal
        gsap.fromTo(img,
          { opacity: 0, scale: 1.08 },
          {
            opacity: 1, scale: 1,
            duration: 1, ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 75%',
            }
          }
        );

        // Text cascade
        gsap.fromTo(text.children,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 70%',
            }
          }
        );

        // Parallax on image
        gsap.to(img, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: 'var(--black)' }}>
      {features.map((f, i) => (
        <div
          key={i}
          ref={el => panelsRef.current[i] = el}
          style={{
            display: 'grid',
            gridTemplateColumns: i % 2 === 0 ? '55% 45%' : '45% 55%',
            minHeight: '80vh',
            overflow: 'hidden',
          }}
        >
          {/* Image (alternates left/right) */}
          {i % 2 === 0 ? (
            <>
              <ImagePanel imgRef={el => imgsRef.current[i] = el} src={f.image} tag={f.tag} />
              <TextPanel textRef={el => textsRef.current[i] = el} f={f} />
            </>
          ) : (
            <>
              <TextPanel textRef={el => textsRef.current[i] = el} f={f} reverse />
              <ImagePanel imgRef={el => imgsRef.current[i] = el} src={f.image} tag={f.tag} />
            </>
          )}
        </div>
      ))}
    </section>
  );
}

function ImagePanel({ imgRef, src, tag }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: 500 }}>
      <img
        ref={imgRef}
        src={src}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '115%',
          objectFit: 'cover', objectPosition: 'center top',
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 60%, rgba(247,244,240,0.1) 100%)',
      }} />
      {/* Tag */}
      <div style={{
        position: 'absolute', top: 28, left: 28,
        background: 'var(--coral)',
        padding: '6px 14px',
        fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
        color: '#fff',
      }}>{tag}</div>
    </div>
  );
}

function TextPanel({ textRef, f, reverse }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: reverse ? '80px 80px 80px 64px' : '80px 64px 80px 80px',
      background: 'var(--black)',
    }}>
      <div ref={textRef}>
        <div style={{
          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--coral)', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ width: 20, height: 1.5, background: 'var(--coral)' }} />
          {f.label}
        </div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(52px, 5vw, 80px)',
          lineHeight: 0.9, letterSpacing: '0.02em',
          marginBottom: 28,
          whiteSpace: 'pre-line',
        }}>
          {f.title}
        </h3>
        <p style={{
          fontSize: 15, lineHeight: 1.8,
          color: 'var(--white-dim)', fontWeight: 300,
          maxWidth: 320,
        }}>
          {f.body}
        </p>
      </div>
    </div>
  );
}
