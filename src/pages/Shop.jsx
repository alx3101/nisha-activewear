import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

gsap.registerPlugin(ScrollTrigger);

const CATS = [
  { key: 'all',      label: 'Tutti',    count: 8 },
  { key: 'sets',     label: 'Sets',     count: 2 },
  { key: 'leggings', label: 'Leggings', count: 3 },
  { key: 'tops',     label: 'Tops',     count: 3 },
];
const SORTS = [
  { key: 'featured',   label: 'In Evidenza' },
  { key: 'price-asc',  label: 'Prezzo ↑' },
  { key: 'price-desc', label: 'Prezzo ↓' },
  { key: 'rating',     label: 'Valutazione' },
];

const CAT_IMAGES = {
  all:      'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=1600&q=85',
  sets:     'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1600&q=85',
  leggings: 'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=1600&q=85',
  tops:     'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=85',
};

export default function Shop() {
  const [sp, setSp]     = useSearchParams();
  const [cat, setCat]   = useState(sp.get('cat') || 'all');
  const [sort, setSort] = useState('featured');
  const isFirstRender   = useRef(true);
  const gridRef         = useRef(null);
  const heroRef         = useRef(null);

  // Sync cat with URL params
  useEffect(() => {
    const c = sp.get('cat');
    setCat(c || 'all');
  }, [sp]);

  // Animate grid only on filter/sort CHANGE (not initial mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!gridRef.current) return;
    const cards = Array.from(gridRef.current.children);
    if (!cards.length) return;
    gsap.fromTo(cards,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.45, ease: 'power2.out', overwrite: true }
    );
  }, [cat, sort]);

  const handleCat = (k) => {
    setCat(k);
    if (k === 'all') sp.delete('cat'); else sp.set('cat', k);
    setSp(sp);
  };

  const list = products
    .filter(p => cat === 'all' || p.category === cat)
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating')     return b.rating - a.rating;
      return 0;
    });

  const catLabel = CATS.find(c => c.key === cat)?.label || 'Tutti';

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>

      {/* ── Editorial Hero ── */}
      <div ref={heroRef} style={{
        position: 'relative',
        height: 'clamp(340px, 45vh, 520px)',
        overflow: 'hidden',
        paddingTop: 80,         /* accounts for fixed navbar */
      }}>
        <img
          src={CAT_IMAGES[cat]}
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '130%',
            objectFit: 'cover', objectPosition: 'center 25%',
            transition: 'opacity 0.5s ease',   /* smooth on cat switch */
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(247,244,240,1) 0%, rgba(26,20,16,0.45) 40%, rgba(26,20,16,0.2) 100%)',
        }} />

        {/* Breadcrumb */}
        <div style={{
          position: 'absolute', top: 100, left: 48,
          display: 'flex', gap: 8, alignItems: 'center',
          fontSize: 11, letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.6)',
        }}>
          <Link to="/" style={{ color: 'inherit', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
          >Home</Link>
          <span>/</span>
          <span style={{ color: '#fff' }}>Shop</span>
        </div>

        {/* Headline — always visible, no opacity animation */}
        <div style={{ position: 'absolute', bottom: 40, left: 48 }}>
          <div style={{
            fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--coral)', marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 20, height: 1.5, background: 'var(--coral)' }} />
            Collezione 2025
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px, 9vw, 120px)',
            lineHeight: 0.88, color: 'var(--white)',
            letterSpacing: '0.01em',
            transition: 'opacity 0.3s',
          }}>
            {catLabel.toUpperCase()}
          </h1>
        </div>

        {/* Count ghost */}
        <div style={{
          position: 'absolute', bottom: 40, right: 48,
          fontFamily: 'var(--font-display)', fontSize: 72,
          color: 'rgba(26,20,16,0.12)', lineHeight: 1,
          userSelect: 'none',
        }}>
          {String(list.length).padStart(2, '0')}
        </div>
      </div>

      {/* ── Sticky filter bar ── */}
      <div style={{
        position: 'sticky', top: 74, zIndex: 100,
        background: 'rgba(247,244,240,0.97)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Category pills */}
          <div style={{ display: 'flex', flex: 1, borderRight: '1px solid var(--border)' }}>
            {CATS.map(({ key, label, count }) => (
              <button key={key} onClick={() => handleCat(key)} style={{
                padding: '17px 22px',
                fontSize: 11, fontWeight: cat === key ? 600 : 400,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: cat === key ? 'var(--coral)' : 'var(--white-dim)',
                background: 'none', border: 'none',
                borderBottom: cat === key ? '2px solid var(--coral)' : '2px solid transparent',
                transition: 'all 0.2s',
              }}>
                {label}
                <sup style={{ fontSize: 8, marginLeft: 3, opacity: 0.5 }}>{count}</sup>
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 0 0 20px' }}>
            <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)' }}>
              Ordina
            </span>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{
              background: 'none', color: 'var(--white)', border: 'none',
              fontSize: 11, fontFamily: 'var(--font-body)', outline: 'none', padding: '17px 4px',
            }}>
              {SORTS.map(o => (
                <option key={o.key} value={o.key} style={{ background: 'var(--black)' }}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="container" style={{ paddingTop: 48, paddingBottom: 100 }}>
        {list.length > 0 ? (
          <div ref={gridRef} className="shop-grid">
            {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--white-dim)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 80, opacity: 0.15 }}>:(</div>
            <div style={{ fontSize: 18, marginTop: 12 }}>Nessun prodotto trovato</div>
          </div>
        )}
      </div>

      <style>{`
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px 16px;
        }
        @media (max-width: 1200px) { .shop-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 900px)  { .shop-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px)  { .shop-grid { grid-template-columns: repeat(2,1fr); gap: 12px 8px; } }
        @media (max-width: 768px) {
          div[style*="bottom: 40px"][style*="left: 48px"] { left: 20px !important; bottom: 24px !important; }
          div[style*="bottom: 40px"][style*="right: 48px"] { display: none !important; }
          div[style*="top: 100px"][style*="left: 48px"]   { left: 20px !important; top: 90px !important; }
        }
      `}</style>
    </div>
  );
}
