import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalProducts() {
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const headerRef   = useRef(null);
  const progressRef = useRef(null);

  // Reveal header + cards on scroll enter
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );

      const cards = trackRef.current?.querySelectorAll('.h-card');
      if (cards?.length) {
        gsap.fromTo(cards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.07, duration: 0.55, ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Update progress bar on horizontal scroll
  useEffect(() => {
    const track = trackRef.current;
    const bar   = progressRef.current;
    if (!track || !bar) return;

    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (!max) return;
      bar.style.transform = `scaleX(${track.scrollLeft / max})`;
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: '100px 0 80px', background: 'var(--dark)', overflow: 'hidden' }}>
      {/* Header */}
      <div ref={headerRef} className="container" style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 1.5, background: 'var(--coral)' }} />
              Scorri per Scoprire
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 0.9, letterSpacing: '0.02em', paddingLeft: 32 }}>
              LA NOSTRA <span style={{ color: 'var(--coral)' }}>COLLEZIONE</span>
            </h2>
          </div>
          <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--white-dim)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--coral)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--white-dim)'}
          >
            Vedi Tutto
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="h-track"
        style={{
          overflowX: 'auto',
          paddingBottom: 16,
          display: 'flex',
          gap: 20,
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: '48px',
          scrollPaddingRight: '48px',
          cursor: 'grab',
        }}
        onMouseDown={e => {
          const el = e.currentTarget;
          el.style.cursor = 'grabbing';
          const startX = e.pageX - el.offsetLeft;
          const scrollLeft = el.scrollLeft;
          const onMove = ev => { el.scrollLeft = scrollLeft - (ev.pageX - el.offsetLeft - startX); };
          const onUp   = ()  => { el.style.cursor = 'grab'; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
        }}
      >
        <style>{`
          .h-track::-webkit-scrollbar { display: none; }
          .h-card-first { margin-left: 48px; }
          .h-card-last  { margin-right: 48px; }
          @media (max-width: 768px) {
            .h-card-first { margin-left: 20px; }
            .h-card-last  { margin-right: 20px; }
            .h-track { scroll-padding-left: 20px; scroll-padding-right: 20px; }
          }
        `}</style>
        {products.map((p, i) => (
          <div key={p.id} className={`h-card${i === 0 ? ' h-card-first' : ''}${i === products.length - 1 ? ' h-card-last' : ''}`} style={{ flexShrink: 0, width: 'clamp(200px, 60vw, 300px)', scrollSnapAlign: 'start' }}>
            <HCard product={p} index={i} />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="hp-progress-wrap" style={{ margin: '28px 48px 0 48px', height: 1, background: 'var(--border)' }}>
        <style>{`@media(max-width:768px){.hp-progress-wrap{margin:20px 20px 0!important}}`}</style>
        <div ref={progressRef} style={{ height: '100%', background: 'var(--coral)', transformOrigin: 'left', transform: 'scaleX(0)', transition: 'transform 0.1s linear' }} />
      </div>
    </section>
  );
}

/* ── Single card ── */
function HCard({ product, index }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded]     = useState(false);
  const cardRef               = useRef(null);
  const { addItem }           = useCart();

  const onLeave = () => {
    setHovered(false);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product, product.sizes[1] || product.sizes[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const BADGE = { BESTSELLER: '#FF3A5E', SALE: '#FFB800', NEW: '#1A1410', 'TOP RATED': '#fff', TRENDING: '#7B61FF' };

  return (
    <div ref={cardRef} onMouseEnter={() => setHovered(true)} onMouseLeave={onLeave}>
      <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '2/3', background: '#EDEAE5' }}>
          <img src={product.image} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.45s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)', opacity: hovered ? 0 : 1, transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
          <img src={product.hoverImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.45s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)', opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(1.06)' }} />

          <span style={{ position: 'absolute', top: 10, left: 12, fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(26,20,16,0.35)' }}>
            {String(index + 1).padStart(2, '0')}
          </span>

          {product.badge && (
            <span style={{ position: 'absolute', top: 10, right: 12, background: BADGE[product.badge] || 'var(--coral)', color: product.badge === 'SALE' || product.badge === 'TOP RATED' ? '#000' : '#fff', fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', padding: '4px 9px' }}>
              {product.badge}
            </span>
          )}

          <button onClick={handleAdd} style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '12px', background: added ? '#00C896' : 'rgba(247,244,240,0.95)',
            backdropFilter: 'blur(10px)', border: 'none',
            color: added ? '#fff' : 'var(--white)',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), background 0.3s',
          }}>
            {added ? '✓ Aggiunto' : '+ Carrello'}
          </button>
        </div>

        <div style={{ padding: '12px 0 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
            <h3 style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3 }}>{product.name}</h3>
            <span style={{ fontSize: 13, fontWeight: 600, color: product.originalPrice ? 'var(--coral)' : 'var(--white)', flexShrink: 0, marginLeft: 8 }}>€{product.price}</span>
          </div>
          <div style={{ display: 'flex', gap: 1 }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="8" height="8" viewBox="0 0 24 24" fill={i < Math.round(product.rating) ? 'var(--coral)' : 'none'} stroke="var(--coral)" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
            <span style={{ fontSize: 9, color: 'var(--white-dim)', marginLeft: 3 }}>({product.reviews})</span>
          </div>
          <div style={{ height: 1.5, background: 'var(--coral)', marginTop: 10, transformOrigin: 'left', transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
        </div>
      </Link>
    </div>
  );
}
