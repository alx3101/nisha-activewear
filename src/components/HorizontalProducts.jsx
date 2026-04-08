import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

gsap.registerPlugin(ScrollTrigger);

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
}

export default function HorizontalProducts() {
  const isMobile    = useIsMobile();
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const headerRef   = useRef(null);

  useEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: section, start: 'top 80%' } }
      );

      const totalWidth = track.scrollWidth - track.clientWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Card stagger reveals
      track.querySelectorAll('.h-card').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0.3, scale: 0.95, y: 20 },
          {
            opacity: 1, scale: 1, y: 0, duration: 0.5,
            scrollTrigger: {
              trigger: section,
              start: `top+=${i * 100} top`,
              end:   `top+=${i * 100 + 80} top`,
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [isMobile]);

  /* ── Header shared ── */
  const Header = () => (
    <div ref={headerRef} className="container" style={{ marginBottom: isMobile ? 28 : 40, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 1.5, background: 'var(--coral)' }} />
            {isMobile ? 'Prodotti' : 'Scorri per Scoprire'}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 0.9, letterSpacing: '0.02em' }}>
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
  );

  /* ── Mobile: simple scrollable grid ── */
  if (isMobile) {
    return (
      <section style={{ padding: '80px 0 60px', background: 'var(--dark)' }}>
        <Header />
        <div style={{ overflowX: 'auto', paddingLeft: 20, paddingRight: 20, paddingBottom: 8, WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
          <div style={{ display: 'flex', gap: 14, width: 'max-content' }}>
            {products.map((p, i) => (
              <div key={p.id} style={{ width: 220, flexShrink: 0, scrollSnapAlign: 'start' }}>
                <HCard product={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Desktop: pinned horizontal scroll ── */
  return (
    <section ref={sectionRef} style={{ height: '100vh', overflow: 'hidden', background: 'var(--dark)' }}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
        <Header />
        <div ref={trackRef} style={{ display: 'flex', gap: 20, paddingLeft: 48, paddingRight: 48, willChange: 'transform', flexShrink: 0 }}>
          {products.map((p, i) => (
            <div key={p.id} className="h-card" style={{ flexShrink: 0, width: 'clamp(240px, 20vw, 320px)' }}>
              <HCard product={p} index={i} />
            </div>
          ))}
        </div>
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

  const onMove = (e) => {
    const el   = cardRef.current;
    const rect = el.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    gsap.to(el, { rotateY: x * 10, rotateX: -y * 6, duration: 0.35, ease: 'power2.out', transformPerspective: 800 });
  };
  const onLeave = () => {
    setHovered(false);
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product, product.sizes[1] || product.sizes[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const BADGE = { BESTSELLER: '#FF3A5E', SALE: '#FFB800', NEW: '#1A1410', 'TOP RATED': '#fff', TRENDING: '#7B61FF' };

  return (
    <div ref={cardRef} onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={onLeave}
      style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
    >
      <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '2/3', background: '#EDEAE5' }}>
          <img src={product.image} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.45s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)', opacity: hovered ? 0 : 1, transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
          <img src={product.hoverImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.45s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)', opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(1.06)' }} />

          {/* Index */}
          <span style={{ position: 'absolute', top: 10, left: 12, fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(26,20,16,0.35)' }}>
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Badge */}
          {product.badge && (
            <span style={{ position: 'absolute', top: 10, right: 12, background: BADGE[product.badge] || 'var(--coral)', color: product.badge === 'SALE' || product.badge === 'TOP RATED' ? '#000' : '#fff', fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', padding: '4px 9px' }}>
              {product.badge}
            </span>
          )}

          {/* Quick add */}
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

        {/* Info */}
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
          {/* Bottom coral line */}
          <div style={{ height: 1.5, background: 'var(--coral)', marginTop: 10, transformOrigin: 'left', transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
        </div>
      </Link>
    </div>
  );
}
