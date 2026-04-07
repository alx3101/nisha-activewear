import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { key: 'all', label: 'Tutti' },
  { key: 'sets', label: 'Sets' },
  { key: 'leggings', label: 'Leggings' },
  { key: 'tops', label: 'Tops' },
];

const SORT_OPTIONS = [
  { key: 'featured', label: 'In Evidenza' },
  { key: 'price-asc', label: 'Prezzo: Crescente' },
  { key: 'price-desc', label: 'Prezzo: Decrescente' },
  { key: 'rating', label: 'Meglio Valutati' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'all');
  const [sort, setSort] = useState('featured');
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.children;
      gsap.fromTo(cards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [activeCategory, sort]);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === 'all') searchParams.delete('cat');
    else searchParams.set('cat', cat);
    setSearchParams(searchParams);
  };

  const filtered = products
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: 'var(--black)' }}>
      <div className="container">
        {/* Header */}
        <div ref={headerRef} style={{ paddingTop: 48, paddingBottom: 48 }}>
          <div style={{
            fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--coral)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 24, height: 1, background: 'var(--coral)' }} />
            Collezione 2025
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px, 8vw, 100px)',
            lineHeight: 0.88,
            letterSpacing: '0.02em',
          }}>
            SHOP<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(26,20,16,0.25)' }}>ALL</span>
          </h1>
        </div>

        {/* Filters bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingBottom: 32, borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap', gap: 16,
        }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleCategory(key)}
                style={{
                  padding: '9px 20px',
                  fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                  fontWeight: 500,
                  background: activeCategory === key ? 'var(--coral)' : 'transparent',
                  color: activeCategory === key ? 'var(--white)' : 'var(--white-dim)',
                  border: activeCategory === key ? '1px solid var(--coral)' : '1px solid var(--border)',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort + count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--white-dim)' }}>
              {filtered.length} prodotti
            </span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                background: 'var(--dark-2)', color: 'var(--white)',
                border: '1px solid var(--border)',
                padding: '9px 16px',
                fontSize: 12, outline: 'none',
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product grid */}
        <div ref={gridRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
          paddingTop: 40, paddingBottom: 80,
        }}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--white-dim)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
            <div style={{ fontSize: 18 }}>Nessun prodotto trovato</div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1200px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 900px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
