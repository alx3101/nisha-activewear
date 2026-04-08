import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products, reviews } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

gsap.registerPlugin(ScrollTrigger);

/* ── Stars ── */
function Stars({ rating, size = 13 }) {
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
  const { id }       = useParams();
  const product      = products.find(p => p.id === parseInt(id));
  const related      = product ? products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3) : [];
  const { addItem }  = useCart();

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize]           = useState(null);
  const [added, setAdded]         = useState(false);

  const leftRef  = useRef(null);
  const rightRef = useRef(null);
  const imgMain  = useRef(null);
  const ctaBar   = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImg(0);
    setSize(null);
    setAdded(false);

    // Animate from y only — never set opacity:0 on mount (causes blank page)
    gsap.fromTo(leftRef.current,
      { x: -16 },
      { x: 0, duration: 0.6, ease: 'power3.out', overwrite: true }
    );
    gsap.fromTo(rightRef.current.children,
      { y: 18 },
      { y: 0, stagger: 0.06, duration: 0.6, ease: 'power3.out', overwrite: true }
    );

    // Sticky CTA bar
    ScrollTrigger.create({
      trigger: ctaBar.current,
      start: 'bottom bottom',
      onEnter: () => gsap.to('.sticky-cta', { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }),
      onLeaveBack: () => gsap.to('.sticky-cta', { y: 80, opacity: 0, duration: 0.3 }),
    });

    return () => { gsap.killTweensOf([leftRef.current, rightRef.current]); ScrollTrigger.getAll().filter(t => t.vars.trigger === ctaBar.current).forEach(t => t.kill()); };
  }, [id]);

  if (!product) return (
    <div style={{ paddingTop: 160, textAlign: 'center', minHeight: '100vh' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 48 }}>Prodotto non trovato</h2>
      <Link to="/shop" style={{ color: 'var(--coral)', display: 'inline-block', marginTop: 20 }}>← Torna allo Shop</Link>
    </div>
  );

  const imgs = [product.image, product.hoverImage];

  const handleAdd = () => {
    if (!size) return;
    addItem(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: 102 }}>

      {/* ── MAIN SPLIT ── */}
      <div className="pd-grid">

        {/* ── LEFT: Gallery ── */}
        <div ref={leftRef} className="pd-left">
          {/* Main image */}
          <div style={{ position: 'relative', overflow: 'hidden', background: '#EDEAE5', width: '100%' }} className="pd-main-img">
            <img ref={imgMain} src={imgs[activeImg]} alt={product.name} style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transition: 'opacity 0.4s ease, transform 0.6s ease',
            }} />

            {/* Badge */}
            {product.badge && (
              <div style={{ position: 'absolute', top: 20, left: 20, background: product.badge === 'SALE' ? '#FFB800' : 'var(--coral)', color: product.badge === 'SALE' ? '#000' : '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', padding: '6px 14px' }}>
                {product.badge}
              </div>
            )}
            {discount > 0 && (
              <div style={{ position: 'absolute', top: product.badge ? 52 : 20, left: 20, background: '#FFB800', color: '#000', fontSize: 9, fontWeight: 700, padding: '6px 12px' }}>
                -{discount}%
              </div>
            )}

            {/* Image nav arrows */}
            {imgs.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => (i - 1 + imgs.length) % imgs.length)} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, background: 'rgba(247,244,240,0.85)', backdropFilter: 'blur(8px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <button onClick={() => setActiveImg(i => (i + 1) % imgs.length)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, background: 'rgba(247,244,240,0.85)', backdropFilter: 'blur(8px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: 8, padding: '8px 0' }}>
            {imgs.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} style={{
                width: 72, height: 90, padding: 0, overflow: 'hidden',
                border: activeImg === i ? '2px solid var(--coral)' : '1px solid var(--border)',
                background: 'none', transition: 'border-color 0.2s', flexShrink: 0,
              }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Info ── */}
        <div ref={rightRef} className="pd-right">

          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: 'var(--white-dim)', marginBottom: 24 }}>
            <Link to="/" style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--white)'} onMouseLeave={e => e.target.style.color='var(--white-dim)'}>Home</Link>
            <span>/</span>
            <Link to="/shop" style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--white)'} onMouseLeave={e => e.target.style.color='var(--white-dim)'}>Shop</Link>
            <span>/</span>
            <span style={{ color: 'var(--white)' }}>{product.name}</span>
          </div>

          {/* Category label */}
          <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 18, height: 1.5, background: 'var(--coral)' }} />
            {product.category}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 5vw, 72px)', lineHeight: 0.88, letterSpacing: '0.02em', marginBottom: 18 }}>
            {product.name.toUpperCase()}
          </h1>

          {/* Rating row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <Stars rating={product.rating} size={14} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{product.rating}</span>
            <span style={{ fontSize: 13, color: 'var(--white-dim)' }}>({product.reviews} recensioni)</span>
            <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--white-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Acquisto Verificato
            </div>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 56, lineHeight: 1, color: product.originalPrice ? 'var(--coral)' : 'var(--white)' }}>
              €{product.price}
            </span>
            {product.originalPrice && (
              <>
                <span style={{ fontSize: 22, color: 'var(--white-dim)', textDecoration: 'line-through' }}>€{product.originalPrice}</span>
                <span style={{ background: '#FFB800', color: '#000', fontSize: 11, fontWeight: 700, padding: '4px 10px' }}>-{discount}%</span>
              </>
            )}
          </div>

          {/* Description */}
          <p style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--white-dim)', fontWeight: 300, marginBottom: 28 }}>
            {product.description}
          </p>

          {/* Color */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: 10 }}>
              Colore — <strong style={{ color: 'var(--white)' }}>{product.color}</strong>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1.5px solid var(--coral)' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: product.colorHex, border: product.colorHex === '#0a0a0a' ? '1px solid rgba(26,20,16,0.3)' : 'none' }} />
              <span style={{ fontSize: 12 }}>{product.color}</span>
            </div>
          </div>

          {/* Size selector */}
          <div ref={ctaBar} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)' }}>
                Taglia {size && <strong style={{ color: 'var(--coral)' }}>— {size}</strong>}
              </div>
              <button style={{ fontSize: 11, color: 'var(--coral)', textDecoration: 'underline', background: 'none', border: 'none' }}>
                Guida taglie
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.sizes.map(s => {
                const sel = size === s;
                return (
                  <button key={s} onClick={() => setSize(s)} style={{
                    width: 54, height: 54, fontSize: 12, fontWeight: 500,
                    border: sel ? '2px solid var(--coral)' : '1px solid var(--border)',
                    background: sel ? 'var(--coral)' : 'var(--black)',
                    color: sel ? '#fff' : 'var(--white)',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                    onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = 'var(--white)'; } }}
                    onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = 'var(--border)'; } }}
                  >
                    {s}
                    {/* pulse on selected */}
                    {sel && <span style={{ position: 'absolute', inset: -4, border: '1px solid rgba(255,58,94,0.3)', pointerEvents: 'none' }} />}
                  </button>
                );
              })}
            </div>
            {!size && <p style={{ fontSize: 11, color: 'rgba(255,58,94,0.6)', marginTop: 8 }}>→ Seleziona una taglia per continuare</p>}
          </div>

          {/* CTA row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <button onClick={handleAdd} style={{
              flex: 1, padding: '18px 24px',
              background: added ? '#00C896' : size ? 'var(--white)' : 'var(--dark-2)',
              color: added ? '#fff' : size ? 'var(--black)' : 'var(--white-dim)',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              border: 'none', transition: 'all 0.35s',
              cursor: size ? 'pointer' : 'not-allowed',
            }}
              onMouseEnter={e => { if (size && !added) { e.currentTarget.style.background = 'var(--coral)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (size && !added) { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--black)'; } }}
            >
              {added ? '✓  Aggiunto al Carrello!' : 'Aggiungi al Carrello'}
            </button>
            <button style={{ width: 56, height: 56, border: '1px solid var(--border)', color: 'var(--white)', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--white)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)', marginBottom: 32 }}>
            {[
              { icon: '🚚', t: 'Spedizione Gratis', s: 'sopra €50' },
              { icon: '↩', t: 'Reso Gratuito', s: '30 giorni' },
              { icon: '🔒', t: 'Pagamento', s: 'Sicuro' },
            ].map(({ icon, t, s }) => (
              <div key={t} style={{ padding: '14px 10px', textAlign: 'center', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>{t}</div>
                <div style={{ fontSize: 10, color: 'var(--white-dim)' }}>{s}</div>
              </div>
            ))}
          </div>

          {/* Features accordion-style */}
          <FeatureRow label="Materiale & Cura" content="92% Polyestere, 8% Elastane. Lavabile a 30°. Non torcere. Stendere all'ombra." />
          <FeatureRow label="Tecnologia Sculpt-Fit™" content="Tessuto brevettato con compressione progressiva che modella la silhouette e migliora la postura durante l'allenamento." />
          <FeatureRow label="Spedizione & Resi" content="Spedizione gratuita sopra €50. Reso gratuito entro 30 giorni. Consegna in 24–48h con corriere espresso." />
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="container" style={{ paddingBottom: 80 }}>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 80, marginTop: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 0.9 }}>
              RECENSIONI <span style={{ color: 'var(--coral)' }}>({product.reviews})</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Stars rating={product.rating} size={16} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--coral)' }}>{product.rating}</span>
            </div>
          </div>

          <div className="reviews-grid">
            {reviews.slice(0, 4).map(r => (
              <div key={r.id} style={{ background: 'var(--dark)', border: '1px solid var(--border)', padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <Stars rating={r.rating} />
                  <span style={{ fontSize: 10, color: 'var(--white-dim)' }}>{r.date}</span>
                </div>
                {/* Tag */}
                <div style={{ display: 'inline-block', background: 'var(--coral-dim)', color: 'var(--coral)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 9px', marginBottom: 12 }}>{r.product}</div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--white)', fontWeight: 300, marginBottom: 18 }}>{r.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <img src={r.avatar} alt={r.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>
                      {r.name}
                      {r.verified && <span style={{ marginLeft: 6, fontSize: 9, color: '#00C896', letterSpacing: '0.1em' }}>✓ VERIFICATA</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--white-dim)' }}>{r.location}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--white-dim)' }}>👍 {r.helpful}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <div className="container" style={{ paddingBottom: 100 }}>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 60, marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 0.9 }}>
              TI POTREBBE{' '}
              <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(26,20,16,0.25)' }}>PIACERE</span>
            </h2>
            <Link to="/shop" style={{ fontSize: 11, color: 'var(--white-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='var(--coral)'}
              onMouseLeave={e => e.target.style.color='var(--white-dim)'}
            >
              Vedi Tutto →
            </Link>
          </div>
          <div className="related-grid">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}

      {/* ── Sticky mobile CTA ── */}
      <div className="sticky-cta" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500,
        padding: '12px 20px',
        background: 'rgba(247,244,240,0.97)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        display: 'none',
        gap: 10,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{product.name}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--coral)' }}>€{product.price}</div>
        </div>
        <button onClick={handleAdd} style={{
          padding: '13px 24px',
          background: added ? '#00C896' : 'var(--coral)',
          color: '#fff', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          border: 'none',
        }}>
          {added ? '✓ Aggiunto' : 'Aggiungi'}
        </button>
      </div>

      <style>{`
        .pd-grid {
          display: grid;
          grid-template-columns: 52% 48%;
          align-items: start;
        }
        .pd-left {
          position: sticky;
          top: 102px;
          align-self: start;
          display: flex;
          flex-direction: column;
          padding: 24px 24px 24px 48px;
          gap: 8px;
        }
        .pd-main-img {
          aspect-ratio: 2/3;
        }
        .pd-right {
          padding: 48px 80px 80px 48px;
        }
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 900px) {
          .pd-grid { grid-template-columns: 1fr !important; }
          .pd-left {
            position: static !important;
            height: auto !important;
            padding: 20px 20px 0 !important;
          }
          .pd-main-img { min-height: 380px; }
          .pd-right { padding: 28px 20px 100px !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .sticky-cta { display: flex !important; }
        }
        @media (max-width: 480px) {
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

/* Accordion row */
function FeatureRow({ label, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 0', background: 'none', border: 'none', color: 'var(--white)',
        fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textAlign: 'left',
      }}>
        {label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'rotate(0)' }}>
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
      <div style={{
        fontSize: 13, color: 'var(--white-dim)', fontWeight: 300, lineHeight: 1.8,
        maxHeight: open ? 200 : 0, overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.25,0.46,0.45,0.94), padding 0.3s',
        paddingBottom: open ? 16 : 0,
      }}>
        {content}
      </div>
    </div>
  );
}
