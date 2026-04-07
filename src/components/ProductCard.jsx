import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const BADGE_COLORS = {
  'BESTSELLER': { bg: 'var(--coral)', color: '#fff' },
  'SALE': { bg: '#FFB800', color: '#000' },
  'NEW': { bg: '#00C896', color: '#fff' },
  'TOP RATED': { bg: 'var(--white)', color: '#000' },
  'TRENDING': { bg: '#7B61FF', color: '#fff' },
};

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    const size = selectedSize || product.sizes[1] || product.sizes[0];
    addItem(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const badge = product.badge && BADGE_COLORS[product.badge];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setSelectedSize(null); }}
      style={{ position: 'relative' }}
    >
      <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
        {/* Image container */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: '3/4',
          background: '#111',
        }}>
          {/* Main image */}
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              opacity: hovered ? 0 : 1,
              position: 'absolute', inset: 0,
            }}
          />
          {/* Hover image */}
          <img
            src={product.hoverImage}
            alt=""
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.5s ease, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1.03)' : 'scale(1.08)',
              position: 'absolute', inset: 0,
            }}
          />

          {/* Badge */}
          {badge && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: badge.bg, color: badge.color,
              fontSize: 9, fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', padding: '4px 10px',
            }}>
              {product.badge}
            </div>
          )}

          {/* Discount badge */}
          {product.originalPrice && (
            <div style={{
              position: 'absolute', top: badge ? 38 : 12, left: 12,
              background: '#FFB800', color: '#000',
              fontSize: 9, fontWeight: 700,
              padding: '4px 10px',
            }}>
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </div>
          )}

          {/* Quick size selector on hover */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(8,8,8,0.85)',
            backdropFilter: 'blur(10px)',
            padding: '12px 16px',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}>
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: 8 }}>
              Seleziona Taglia
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={e => { e.preventDefault(); setSelectedSize(size); }}
                  style={{
                    padding: '5px 10px',
                    fontSize: 11, fontWeight: 500,
                    border: selectedSize === size ? '1px solid var(--coral)' : '1px solid rgba(255,255,255,0.2)',
                    background: selectedSize === size ? 'var(--coral)' : 'transparent',
                    color: selectedSize === size ? '#fff' : 'var(--white-dim)',
                    transition: 'all 0.15s',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Wishlist */}
          <button
            onClick={e => e.preventDefault()}
            style={{
              position: 'absolute', top: 12, right: 12,
              width: 32, height: 32,
              background: 'rgba(8,8,8,0.7)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s',
              color: 'var(--white)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: '16px 0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', marginBottom: 4 }}>
                {product.name}
              </h3>
              {/* Stars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ display: 'flex', gap: 1 }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="10" height="10" viewBox="0 0 24 24"
                      fill={i < Math.round(product.rating) ? 'var(--coral)' : 'none'}
                      stroke="var(--coral)" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: 10, color: 'var(--white-dim)' }}>({product.reviews})</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: product.originalPrice ? 'var(--coral)' : 'var(--white)' }}>
                €{product.price}
              </div>
              {product.originalPrice && (
                <div style={{ fontSize: 12, color: 'var(--white-dim)', textDecoration: 'line-through' }}>
                  €{product.originalPrice}
                </div>
              )}
            </div>
          </div>

          {/* Color dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: product.colorHex,
              border: product.colorHex === '#0a0a0a' ? '1px solid rgba(255,255,255,0.3)' : 'none',
            }} />
            <span style={{ fontSize: 11, color: 'var(--white-dim)' }}>{product.color}</span>
          </div>
        </div>
      </Link>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        style={{
          width: '100%',
          padding: '12px',
          background: added ? '#00C896' : 'var(--dark-2)',
          border: '1px solid var(--border)',
          color: 'var(--white)',
          fontSize: 11, fontWeight: 600,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          transition: 'all 0.3s',
        }}
        onMouseEnter={e => { if (!added) { e.currentTarget.style.background = 'var(--coral)'; e.currentTarget.style.borderColor = 'var(--coral)'; }}}
        onMouseLeave={e => { if (!added) { e.currentTarget.style.background = 'var(--dark-2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}}
      >
        {added ? '✓ Aggiunto al Carrello' : 'Aggiungi al Carrello'}
      </button>
    </div>
  );
}
