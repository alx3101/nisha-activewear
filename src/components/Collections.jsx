import { useState, useEffect, useRef, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cols = [
  {
    name: 'Sets', tag: 'sets', label: 'La coppia perfetta', sub: '3 prodotti', num: '01',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=85',
  },
  {
    name: 'Leggings', tag: 'leggings', label: 'Push-up & Sculpt', sub: '4 prodotti', num: '02',
    image: 'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=1200&q=85',
  },
  {
    name: 'Tops', tag: 'tops', label: 'Sport & Style', sub: '3 prodotti', num: '03',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=85',
  },
];

export default function Collections() {
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);
  const rowRefs    = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' } }
      );

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const img  = row.querySelector('.col-img');
        const text = row.querySelector('.col-text');

        gsap.fromTo(img,
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: row, start: 'top 78%' } }
        );
        gsap.fromTo(text.children,
          { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 75%' } }
        );
        gsap.to(img.querySelector('img'), {
          yPercent: 10, ease: 'none',
          scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: '120px 0 60px', background: 'var(--black)' }}>
      <div className="container">
        {/* Header */}
        <div ref={headerRef} className="col-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 72 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 1.5, background: 'var(--coral)' }} />
              Le Nostre Categorie
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 7vw, 100px)', lineHeight: 0.88, letterSpacing: '0.02em' }}>
              SHOP<br/>
              <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(26,20,16,0.25)' }}>BY LOOK</span>
            </h2>
          </div>
          <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--white-dim)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--coral)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--white-dim)'}
          >
            Vedi Tutto
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {cols.map((col, i) => (
            <CollectionRow key={col.tag} col={col} reverse={i % 2 !== 0} ref={el => rowRefs.current[i] = el} />
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .col-row  { grid-template-columns: 1fr !important; height: auto !important; }
          .col-img  { height: 260px !important; order: -1 !important; }
          .col-text { padding: 28px 18px !important; order: 0 !important; }
          .col-header { margin-bottom: 36px !important; }
        }
      `}</style>
    </section>
  );
}

const CollectionRow = forwardRef(({ col, reverse }, ref) => {
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} className="col-row" style={{ display: 'grid', gridTemplateColumns: reverse ? '40% 60%' : '60% 40%', height: 'clamp(320px, 36vw, 500px)', overflow: 'hidden' }}>
      {!reverse && <ImgSide col={col} hov={hov} setHov={setHov} />}
      <TxtSide col={col} hov={hov} setHov={setHov} reverse={reverse} />
      {reverse  && <ImgSide col={col} hov={hov} setHov={setHov} />}
    </div>
  );
});

function ImgSide({ col, hov, setHov }) {
  return (
    <Link to={`/shop?cat=${col.tag}`} className="col-img"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'block', position: 'relative', overflow: 'hidden', height: '100%' }}
    >
      <img src={col.image} alt={col.name} style={{
        width: '100%', height: '115%', objectFit: 'cover', objectPosition: 'center top',
        transition: 'transform 1s cubic-bezier(0.25,0.46,0.45,0.94)',
        transform: hov ? 'scale(1.06)' : 'scale(1)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, rgba(26,20,16,${hov ? 0.75 : 0.5}) 100%)`, transition: 'background 0.5s' }} />
      <div style={{ position: 'absolute', top: 16, left: 22, fontFamily: 'var(--font-display)', fontSize: 'clamp(64px, 9vw, 120px)', lineHeight: 1, color: 'rgba(255,255,255,0.1)', userSelect: 'none' }}>{col.num}</div>
    </Link>
  );
}

function TxtSide({ col, hov, setHov, reverse }) {
  return (
    <Link to={`/shop?cat=${col.tag}`} className="col-text"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: reverse ? '48px 56px 48px 48px' : '48px 48px 48px 56px', background: hov ? 'var(--dark)' : 'var(--black)', transition: 'background 0.4s', height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', bottom: -24, right: -8, fontFamily: 'var(--font-display)', fontSize: '18vw', lineHeight: 1, color: 'rgba(255,58,94,0.04)', userSelect: 'none' }}>{col.num}</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 1.5, background: 'var(--coral)' }} />
          {col.label}
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 5.5vw, 80px)', lineHeight: 0.88, letterSpacing: '0.03em', marginBottom: 20, color: 'var(--white)' }}>
          {col.name.toUpperCase()}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: 'var(--white-dim)' }}>
          <span>{col.sub}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 14, opacity: hov ? 1 : 0, transform: hov ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--white)' }}>Esplora</span>
        </div>
      </div>
    </Link>
  );
}
