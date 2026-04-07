import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { products, reviews } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

function Stars({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? 'var(--coral)' : 'none'}
          stroke="var(--coral)" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const imgRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo([imgRef.current, infoRef.current],
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out' }
    );
  }, [id]);

  if (!product) {
    return (
      <div style={{ paddingTop: 160, textAlign: 'center', minHeight: '100vh' }}>
        <h2>Prodotto non trovato</h2>
        <Link to="/shop" style={{ color: 'var(--coral)', marginTop: 20, display: 'inline-block' }}>
          Torna allo Shop →
        </Link>
      </div>
    );
  }

  const images = [product.image, product.hoverImage];
  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div style={{ paddingTop: 100, background: 'var(--black)', minHeight: '100vh' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ paddingTop: 32, paddingBottom: 40, display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--white-dim)' }}>
          <Link to="/" style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--white)'} onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--white)'} onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}>Shop</Link>
          <span>/</span>
          <span style={{ color: 'var(--white)' }}>{product.name}</span>
        </div>

        {/* Main product */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 72,
          paddingBottom: 100,
        }}>
          {/* Images */}
          <div ref={imgRef}>
            {/* Main image */}
            <div style={{ position: 'relative', overflow: 'hidden', marginBottom: 12 }}>
              <img
                src={images[activeImg]}
                alt={product.name}
                style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', transition: 'opacity 0.3s' }}
              />
              {product.badge && (
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  background: product.badge === 'SALE' ? '#FFB800' : 'var(--coral)',
                  color: product.badge === 'SALE' ? '#000' : '#fff',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
                  padding: '5px 12px',
                }}>
                  {product.badge}
                </div>
              )}
            </div>
            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: 8 }}>
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{
                  width: 80, height: 100, padding: 0,
                  border: activeImg === i ? '2px solid var(--coral)' : '1px solid var(--border)',
                  overflow: 'hidden', transition: 'border-color 0.2s',
                }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div ref={infoRef}>
            {/* Category */}
            <div style={{
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--coral)', marginBottom: 12,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 20, height: 1, background: 'var(--coral)' }} />
              {product.category}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 4vw, 56px)',
              lineHeight: 0.95, letterSpacing: '0.03em',
              marginBottom: 20,
            }}>
              {product.name.toUpperCase()}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Stars rating={product.rating} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{product.rating}</span>
              <span style={{ fontSize: 13, color: 'var(--white-dim)' }}>({product.reviews} recensioni)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28 }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 44,
                color: product.originalPrice ? 'var(--coral)' : 'var(--white)',
              }}>€{product.price}</div>
              {product.originalPrice && (
                <div style={{ fontSize: 20, color: 'var(--white-dim)', textDecoration: 'line-through' }}>
                  €{product.originalPrice}
                </div>
              )}
              {product.originalPrice && (
                <div style={{
                  background: '#FFB800', color: '#000',
                  fontSize: 12, fontWeight: 700,
                  padding: '3px 10px',
                }}>
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Description */}
            <p style={{
              fontSize: 15, lineHeight: 1.8, fontWeight: 300,
              color: 'var(--white-dim)', marginBottom: 32,
              paddingBottom: 32, borderBottom: '1px solid var(--border)',
            }}>
              {product.description}
            </p>

            {/* Color */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, color: 'var(--white-dim)' }}>
                Colore: <strong style={{ color: 'var(--white)' }}>{product.color}</strong>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px',
                border: '1px solid var(--coral)',
                display: 'inline-flex',
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: product.colorHex,
                  border: product.colorHex === '#0a0a0a' ? '1px solid rgba(255,255,255,0.3)' : 'none',
                }} />
                <span style={{ fontSize: 13 }}>{product.color}</span>
              </div>
            </div>

            {/* Size selector */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--white-dim)' }}>
                  Taglia {selectedSize && <strong style={{ color: 'var(--white)' }}>— {selectedSize}</strong>}
                </div>
                <button style={{ fontSize: 12, color: 'var(--coral)', textDecoration: 'underline' }}>
                  Guida alle taglie
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)} style={{
                    width: 52, height: 52,
                    fontSize: 13, fontWeight: 500,
                    border: selectedSize === size ? '2px solid var(--coral)' : '1px solid var(--border)',
                    background: selectedSize === size ? 'var(--coral)' : 'transparent',
                    color: selectedSize === size ? '#fff' : 'var(--white)',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { if (selectedSize !== size) e.currentTarget.style.borderColor = 'var(--white)'; }}
                    onMouseLeave={e => { if (selectedSize !== size) e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <div style={{ fontSize: 12, color: 'rgba(255,58,94,0.7)', marginTop: 8 }}>
                  Seleziona una taglia per continuare
                </div>
              )}
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <button onClick={handleAdd} style={{
                flex: 1, padding: '18px',
                background: added ? '#00C896' : selectedSize ? 'var(--coral)' : 'var(--dark-2)',
                color: 'var(--white)',
                fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                border: 'none',
                transition: 'all 0.3s',
                opacity: !selectedSize && !added ? 0.7 : 1,
              }}>
                {added ? '✓ Aggiunto al Carrello!' : 'Aggiungi al Carrello'}
              </button>
              <button style={{
                width: 56, height: 56,
                border: '1px solid var(--border)',
                color: 'var(--white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--white)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1, background: 'var(--border)',
              border: '1px solid var(--border)',
            }}>
              {[
                { icon: '🚚', text: 'Spedizione Gratis', sub: 'sopra €50' },
                { icon: '↩', text: 'Reso Gratuito', sub: '30 giorni' },
                { icon: '🔒', text: 'Pagamento', sub: 'Sicuro' },
              ].map(({ icon, text, sub }) => (
                <div key={text} style={{
                  background: 'var(--dark)', textAlign: 'center',
                  padding: '16px 8px',
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 500 }}>{text}</div>
                  <div style={{ fontSize: 10, color: 'var(--white-dim)' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div style={{ paddingBottom: 100 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 48, letterSpacing: '0.05em',
            marginBottom: 40,
            paddingBottom: 24, borderBottom: '1px solid var(--border)',
          }}>
            RECENSIONI <span style={{ color: 'var(--coral)' }}>({product.reviews})</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {reviews.slice(0, 4).map(review => (
              <div key={review.id} style={{
                background: 'var(--dark)',
                border: '1px solid var(--border)',
                padding: 24,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Stars rating={review.rating} />
                  <span style={{ fontSize: 11, color: 'var(--white-dim)' }}>{review.date}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--white)', fontWeight: 300, marginBottom: 16 }}>
                  {review.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={review.avatar} alt={review.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{review.name}</span>
                    {review.verified && <span style={{ marginLeft: 6, fontSize: 10, color: '#00C896' }}>✓ VERIFICATA</span>}
                    <div style={{ fontSize: 11, color: 'var(--white-dim)' }}>{review.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ paddingBottom: 100 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 48, letterSpacing: '0.05em',
              marginBottom: 40,
              paddingBottom: 24, borderBottom: '1px solid var(--border)',
            }}>
              TI POTREBBE <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(242,237,232,0.4)' }}>PIACERE</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 32px !important; }
          div[style*="repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
