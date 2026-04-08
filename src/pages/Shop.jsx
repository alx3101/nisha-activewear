import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const CATS = [
  { key: 'all',      label: 'Tutti' },
  { key: 'sets',     label: 'Sets' },
  { key: 'leggings', label: 'Leggings' },
  { key: 'tops',     label: 'Tops' },
];
const SORTS = [
  { key: 'featured',   label: 'In Evidenza' },
  { key: 'newest',     label: 'Novità' },
  { key: 'price-asc',  label: 'Prezzo ↑' },
  { key: 'price-desc', label: 'Prezzo ↓' },
  { key: 'rating',     label: 'Più votati' },
];
const SIZES   = ['XS', 'S', 'M', 'L', 'XL'];
const PRICES  = [
  { key: 'all',   label: 'Tutti' },
  { key: '0-30',  label: 'Sotto €30' },
  { key: '30-50', label: '€30 – €50' },
  { key: '50+',   label: 'Sopra €50' },
];
const ALL_COLORS = [...new Map(
  products.map(p => [p.colorHex, { hex: p.colorHex, name: p.color }])
).values()];

export default function Shop() {
  const [sp, setSp]             = useSearchParams();
  const [cat, setCat]           = useState(sp.get('cat') || 'all');
  const [sort, setSort]         = useState('featured');
  const [sizes, setSizes]       = useState([]);
  const [color, setColor]       = useState(null);
  const [price, setPrice]       = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const isFirstRender           = useRef(true);
  const gridRef                 = useRef(null);

  useEffect(() => {
    const c = sp.get('cat');
    setCat(c || 'all');
  }, [sp]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!gridRef.current) return;
    const cards = Array.from(gridRef.current.children);
    if (!cards.length) return;
    gsap.fromTo(cards,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.04, duration: 0.38, ease: 'power2.out', overwrite: true }
    );
  }, [cat, sort, sizes, color, price]);

  // Lock body scroll when filter sheet is open
  useEffect(() => {
    document.body.style.overflow = filterOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [filterOpen]);

  const handleCat = (k) => {
    setCat(k);
    if (k === 'all') sp.delete('cat'); else sp.set('cat', k);
    setSp(sp);
  };
  const toggleSize = (s) =>
    setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const clearAll = () => { setSizes([]); setColor(null); setPrice('all'); };

  const activeCount = (sizes.length > 0 ? 1 : 0) + (color ? 1 : 0) + (price !== 'all' ? 1 : 0);

  const list = products
    .filter(p => cat === 'all' || p.category === cat)
    .filter(p => sizes.length === 0 || sizes.some(s => p.sizes.includes(s)))
    .filter(p => !color || p.colorHex === color)
    .filter(p => {
      if (price === '0-30')  return p.price < 30;
      if (price === '30-50') return p.price >= 30 && p.price <= 50;
      if (price === '50+')   return p.price > 50;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating')     return b.rating - a.rating;
      if (sort === 'newest')     return (b.new ? 1 : 0) - (a.new ? 1 : 0);
      return 0;
    });

  const filterContent = (
    <>
      <FilterSection title="Categoria">
        {CATS.map(({ key, label }) => {
          const count = key === 'all' ? products.length : products.filter(p => p.category === key).length;
          return (
            <button key={key} onClick={() => { handleCat(key); }} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              width: '100%', padding: '8px 0',
              fontSize: 13, fontWeight: cat === key ? 600 : 400,
              color: cat === key ? 'var(--coral)' : 'var(--white)',
              background: 'none', border: 'none', textAlign: 'left',
              borderLeft: cat === key ? '2px solid var(--coral)' : '2px solid transparent',
              paddingLeft: 10, transition: 'all 0.2s',
            }}>
              {label}
              <span style={{ fontSize: 10, color: 'var(--white-dim)', fontWeight: 400 }}>{count}</span>
            </button>
          );
        })}
      </FilterSection>

      <FilterSection title="Taglia">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SIZES.map(s => (
            <button key={s} onClick={() => toggleSize(s)} style={{
              width: 44, height: 40, fontSize: 11, fontWeight: 500,
              border: sizes.includes(s) ? '1.5px solid var(--coral)' : '1px solid var(--border)',
              color: sizes.includes(s) ? 'var(--coral)' : 'var(--white-dim)',
              background: sizes.includes(s) ? 'var(--coral-dim)' : 'none',
              transition: 'all 0.18s',
            }}>{s}</button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Colore">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingLeft: 2 }}>
          {ALL_COLORS.map(({ hex, name }) => (
            <button key={hex} title={name} onClick={() => setColor(color === hex ? null : hex)} style={{
              width: 28, height: 28, borderRadius: '50%',
              background: hex,
              border: color === hex ? '2.5px solid var(--coral)' : '2px solid rgba(26,20,16,0.15)',
              boxShadow: color === hex ? '0 0 0 3px var(--coral-glow)' : 'none',
              transition: 'all 0.18s',
            }} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Prezzo">
        {PRICES.map(({ key, label }) => (
          <button key={key} onClick={() => setPrice(key)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '7px 0',
            fontSize: 12, background: 'none', border: 'none', textAlign: 'left',
            color: price === key ? 'var(--coral)' : 'var(--white-dim)',
            transition: 'color 0.18s',
          }}>
            <span style={{
              width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
              border: price === key ? '2px solid var(--coral)' : '1.5px solid var(--border)',
              background: price === key ? 'var(--coral)' : 'none',
              transition: 'all 0.18s',
            }} />
            {label}
          </button>
        ))}
      </FilterSection>

      {activeCount > 0 && (
        <button onClick={clearAll} style={{
          marginTop: 8, padding: '10px 0', width: '100%',
          fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--coral)', background: 'none',
          border: '1px solid var(--coral-glow)',
          transition: 'background 0.2s',
        }}>
          Rimuovi filtri ({activeCount})
        </button>
      )}
    </>
  );

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: 102 }}>

      {/* ── Page header ── */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--black)' }}>
        <div className="container shop-header-inner" style={{ padding: '16px 48px' }}>

          {/* Row 1: breadcrumb */}
          <div style={{ display: 'flex', gap: 6, fontSize: 11, color: 'var(--white-dim)', letterSpacing: '0.06em', marginBottom: 10 }}>
            <Link to="/" style={{ color: 'inherit', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--coral)'}
              onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}
            >Home</Link>
            <span>/</span>
            <span>Shop</span>
            {cat !== 'all' && <><span>/</span><span style={{ color: 'var(--coral)' }}>{CATS.find(c => c.key === cat)?.label}</span></>}
          </div>

          {/* Row 2: title + controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 42px)', letterSpacing: '0.04em', lineHeight: 1 }}>
              {cat === 'all' ? 'SHOP' : CATS.find(c => c.key === cat)?.label.toUpperCase()}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Product count */}
              <span className="shop-count" style={{ fontSize: 12, color: 'var(--white-dim)', whiteSpace: 'nowrap' }}>
                {list.length} {list.length === 1 ? 'prodotto' : 'prodotti'}
              </span>

              {/* Sort */}
              <select value={sort} onChange={e => setSort(e.target.value)} style={{
                background: 'var(--black)', color: 'var(--white)',
                border: '1px solid var(--border)',
                fontSize: 12, fontFamily: 'var(--font-body)',
                outline: 'none', padding: '8px 10px',
              }}>
                {SORTS.map(o => <option key={o.key} value={o.key} style={{ background: 'var(--black)' }}>{o.label}</option>)}
              </select>

              {/* Filter button — mobile only */}
              <button className="shop-filter-btn" onClick={() => setFilterOpen(true)} style={{
                display: 'none',
                alignItems: 'center', gap: 6,
                padding: '8px 14px',
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--white)',
                fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                position: 'relative',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filtri
                {activeCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -6, right: -6,
                    background: 'var(--coral)', color: '#fff',
                    borderRadius: '50%', width: 16, height: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700,
                  }}>{activeCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout: sidebar + grid ── */}
      <div className="container shop-layout" style={{ display: 'flex', gap: 0, padding: '0 48px', alignItems: 'flex-start' }}>

        {/* ── Sidebar (desktop) ── */}
        <aside style={{
          width: 220, flexShrink: 0,
          paddingTop: 36, paddingRight: 40, paddingBottom: 60,
          position: 'sticky', top: 102,
          maxHeight: 'calc(100vh - 102px)',
          overflowY: 'auto', scrollbarWidth: 'none',
          borderRight: '1px solid var(--border)',
        }}>
          {filterContent}
        </aside>

        {/* ── Product grid ── */}
        <div style={{ flex: 1, paddingLeft: 40, paddingTop: 36, paddingBottom: 80 }}>
          {list.length > 0 ? (
            <div ref={gridRef} className="shop-grid">
              {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--white-dim)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 72, opacity: 0.1 }}>0</div>
              <div style={{ fontSize: 16, marginTop: 12, marginBottom: 20 }}>Nessun prodotto trovato</div>
              <button onClick={() => { clearAll(); handleCat('all'); }}
                style={{ padding: '12px 28px', background: 'var(--coral)', color: '#fff', border: 'none', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Rimuovi tutti i filtri
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filter sheet ── */}
      {filterOpen && (
        <div onClick={() => setFilterOpen(false)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,20,16,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
        }} />
      )}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: 2001,
        background: 'var(--black)',
        borderTop: '1px solid var(--border)',
        borderRadius: '16px 16px 0 0',
        padding: '0 20px 40px',
        maxHeight: '80vh',
        overflowY: 'auto',
        transform: filterOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 20px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.04em' }}>FILTRI</span>
          <button onClick={() => setFilterOpen(false)} style={{
            background: 'none', border: 'none', color: 'var(--white-dim)', fontSize: 22, lineHeight: 1,
          }}>×</button>
        </div>
        {filterContent}
        {/* Apply button */}
        <button onClick={() => setFilterOpen(false)} style={{
          marginTop: 24, width: '100%', padding: '16px',
          background: 'var(--coral)', color: '#fff',
          border: 'none', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          Vedi {list.length} {list.length === 1 ? 'prodotto' : 'prodotti'}
        </button>
      </div>

      <style>{`
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px 20px;
        }
        @media (max-width: 1100px) { .shop-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 900px) {
          .shop-grid { grid-template-columns: repeat(2, 1fr); gap: 16px 10px; }
          aside { display: none !important; }
          .shop-filter-btn { display: flex !important; }
          .shop-header-inner { padding: 14px 18px !important; }
          .shop-layout { padding: 0 18px !important; }
          .shop-layout > div { padding-left: 0 !important; }
          .shop-count { display: none; }
        }
        @media (max-width: 480px) {
          .shop-grid { grid-template-columns: 1fr 1fr; gap: 12px 8px; }
          .shop-header-inner { padding: 12px 14px !important; }
          .shop-layout { padding: 0 14px !important; }
        }
      `}</style>
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--white-dim)', marginBottom: 14, fontWeight: 600,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}
