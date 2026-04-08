import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useCart } from '../context/CartContext';

const BADGE = {
  BESTSELLER: { bg: 'var(--coral)', color: '#fff' },
  SALE:       { bg: '#FFB800',       color: '#000' },
  NEW:        { bg: '#1A1410',       color: '#fff' },
  'TOP RATED':{ bg: '#fff',          color: '#1A1410' },
  TRENDING:   { bg: '#7B61FF',       color: '#fff' },
};

export default function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered]     = useState(false);
  const [selectedSize, setSize]   = useState(null);
  const [added, setAdded]         = useState(false);
  const { addItem }               = useCart();
  const cardRef                   = useRef(null);
  const imgRef                    = useRef(null);
  const panelRef                  = useRef(null);
  const btnRef                    = useRef(null);

  /* 3-D tilt on mouse move */
  const onMove = (e) => {
    const el  = cardRef.current;
    const rect = el.getBoundingClientRect();
    const x   = (e.clientX - rect.left) / rect.width  - 0.5;
    const y   = (e.clientY - rect.top)  / rect.height - 0.5;
    gsap.to(el, {
      rotateY: x * 10, rotateX: -y * 6,
      duration: 0.4, ease: 'power2.out',
      transformPerspective: 900,
    });
  };
  const onLeave = () => {
    setHovered(false);
    setSize(null);
    gsap.to(cardRef.current, {
      rotateY: 0, rotateX: 0,
      duration: 0.8, ease: 'elastic.out(1,0.5)',
    });
  };

  /* Magnetic CTA */
  const onBtnMove = (e) => {
    const el   = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x    = e.clientX - rect.left - rect.width / 2;
    const y    = e.clientY - rect.top  - rect.height / 2;
    gsap.to(el, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: 'power2.out' });
  };
  const onBtnLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const size = selectedSize || product.sizes[1] || product.sizes[0];
    addItem(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const badge = product.badge && BADGE[product.badge];
  const num   = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ position: 'relative', transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      <Link to={`/product/${product.id}`} style={{ display: 'block' }}>

        {/* ── Image ── */}
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '2/3', background: '#EDEAE5' }}>

          {/* Index number */}
          <span style={{
            position: 'absolute', top: 14, left: 14, zIndex: 3,
            fontFamily: 'var(--font-display)',
            fontSize: 11, letterSpacing: '0.15em',
            color: 'rgba(26,20,16,0.4)',
          }}>{num}</span>

          {/* Badge */}
          {badge && (
            <span style={{
              position: 'absolute', top: 14, right: 14, zIndex: 3,
              background: badge.bg, color: badge.color,
              fontSize: 8, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', padding: '5px 11px',
            }}>{product.badge}</span>
          )}

          {/* Sale ribbon */}
          {product.originalPrice && (
            <span style={{
              position: 'absolute', top: badge ? 42 : 14, right: 14, zIndex: 3,
              background: '#FFB800', color: '#000',
              fontSize: 8, fontWeight: 700, padding: '5px 10px',
            }}>
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}

          {/* Images */}
          <img ref={imgRef} src={product.image} alt={product.name} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.55s ease, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
            opacity: hovered ? 0 : 1,
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }} />
          <img src={product.hoverImage} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.55s ease, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1)' : 'scale(1.05)',
          }} />

          {/* Wishlist */}
          <button onClick={e => e.preventDefault()} style={{
            position: 'absolute', top: 14, right: badge ? 74 : 14, zIndex: 4,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(247,244,240,0.85)', backdropFilter: 'blur(8px)',
            border: 'none', color: '#1A1410',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Hover panel: sizes + CTA */}
          <div ref={panelRef} style={{
            position: 'absolute', inset: '0 0 0 0',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            background: 'linear-gradient(to top, rgba(247,244,240,0.97) 0%, rgba(247,244,240,0.6) 35%, transparent 65%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.35s ease',
            padding: '16px 14px 14px',
            zIndex: 2,
          }}>
            {/* Sizes */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: 7 }}>
                Taglia rapida
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={e => { e.preventDefault(); setSize(s); }} style={{
                    padding: '5px 10px', fontSize: 10, fontWeight: 600,
                    background: selectedSize === s ? 'var(--coral)' : 'rgba(247,244,240,0.9)',
                    color: selectedSize === s ? '#fff' : 'var(--white)',
                    border: selectedSize === s ? '1px solid var(--coral)' : '1px solid rgba(26,20,16,0.15)',
                    transition: 'all 0.15s',
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              ref={btnRef}
              onClick={handleAdd}
              onMouseMove={onBtnMove}
              onMouseLeave={onBtnLeave}
              style={{
                width: '100%', padding: '13px 0',
                background: added ? '#00C896' : 'var(--white)',
                color: added ? '#fff' : 'var(--black)',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                border: 'none',
                transition: 'background 0.3s, color 0.3s',
              }}
              onMouseEnter={e => { if (!added) { e.currentTarget.style.background = 'var(--coral)'; e.currentTarget.style.color = '#fff'; }}}
              onMouseLeave2={e => { if (!added) { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--black)'; }}}
            >
              {added ? '✓  Aggiunto!' : '+ Carrello'}
            </button>
          </div>
        </div>

        {/* ── Info ── */}
        <div style={{ padding: '14px 2px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <h3 style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3, letterSpacing: '0.01em' }}>{product.name}</h3>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: product.originalPrice ? 'var(--coral)' : 'var(--white)' }}>
                €{product.price}
              </div>
              {product.originalPrice && (
                <div style={{ fontSize: 11, color: 'var(--white-dim)', textDecoration: 'line-through', marginTop: -1 }}>
                  €{product.originalPrice}
                </div>
              )}
            </div>
          </div>

          {/* Stars + color */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="9" height="9" viewBox="0 0 24 24"
                  fill={i < Math.round(product.rating) ? 'var(--coral)' : 'none'}
                  stroke="var(--coral)" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
              <span style={{ fontSize: 10, color: 'var(--white-dim)', marginLeft: 2 }}>({product.reviews})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 9, height: 9, borderRadius: '50%', background: product.colorHex,
                border: product.colorHex === '#0a0a0a' ? '1px solid rgba(26,20,16,0.3)' : 'none',
              }} />
              <span style={{ fontSize: 10, color: 'var(--white-dim)' }}>{product.color}</span>
            </div>
          </div>

          {/* Hover line */}
          <div style={{
            height: 1.5, background: 'var(--coral)', marginTop: 12,
            transformOrigin: 'left',
            transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
          }} />
        </div>
      </Link>
    </div>
  );
}
