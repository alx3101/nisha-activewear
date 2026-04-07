import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalProducts() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    // Header reveal
    gsap.fromTo(headerRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: section, start: 'top 80%' }
      }
    );

    // Horizontal scroll pinned
    const totalWidth = track.scrollWidth - track.clientWidth;

    const ctx = gsap.context(() => {
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
        }
      });

      // Each card reveals as it enters view
      const cards = track.querySelectorAll('.h-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0.4, scale: 0.96, y: 20 },
          {
            opacity: 1, scale: 1, y: 0, duration: 0.5,
            scrollTrigger: {
              trigger: section,
              start: `top+=${i * 120} top`,
              end: `top+=${i * 120 + 60} top`,
              scrub: false,
              toggleActions: 'play none none reverse',
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--dark)',
    }}>
      {/* Sticky inner */}
      <div style={{
        height: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div ref={headerRef} className="container" style={{ marginBottom: 40, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{
                fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
                color: 'var(--coral)', marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 24, height: 1.5, background: 'var(--coral)' }} />
                Scorri per Scoprire
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 5.5vw, 72px)',
                lineHeight: 0.9, letterSpacing: '0.02em',
              }}>
                LA NOSTRA{' '}
                <span style={{ color: 'var(--coral)' }}>COLLEZIONE</span>
              </h2>
            </div>
            <Link to="/shop" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--white-dim)', transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--coral)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--white-dim)'}
            >
              Vedi Tutto
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Scrolling track */}
        <div ref={trackRef} style={{
          display: 'flex',
          gap: 20,
          paddingLeft: 48,
          paddingRight: 48,
          willChange: 'transform',
          flexShrink: 0,
        }}>
          {products.map((product, i) => (
            <HCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          /* disable pinned horizontal scroll on mobile */
          section { height: auto !important; overflow: auto !important; }
        }
      `}</style>
    </section>
  );
}

function HCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const cardRef = useRef(null);
  const { addItem } = useCart();

  const onMove = (e) => {
    const el = cardRef.current;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: x * 12, rotateX: -y * 8,
      duration: 0.4, ease: 'power2.out',
      transformPerspective: 800,
    });
  };
  const onLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0, rotateX: 0,
      duration: 0.6, ease: 'elastic.out(1, 0.5)',
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product, product.sizes[1] || product.sizes[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const BADGE_COLORS = {
    'BESTSELLER': { bg: 'var(--coral)', color: '#fff' },
    'SALE': { bg: '#FFB800', color: '#000' },
    'NEW': { bg: '#00C896', color: '#fff' },
    'TOP RATED': { bg: 'var(--white)', color: '#000' },
    'TRENDING': { bg: '#7B61FF', color: '#fff' },
  };
  const badge = product.badge && BADGE_COLORS[product.badge];

  return (
    <div
      className="h-card"
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => setHovered(true)}
      style={{
        flexShrink: 0,
        width: 'clamp(260px, 22vw, 340px)',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
        {/* Image */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          aspectRatio: '3/4',
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s',
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              opacity: hovered ? 0 : 1,
              position: 'absolute', inset: 0,
            }}
          />
          <img
            src={product.hoverImage}
            alt=""
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.5s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1.02)' : 'scale(1.07)',
              position: 'absolute', inset: 0,
            }}
          />

          {badge && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: badge.bg, color: badge.color,
              fontSize: 9, fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', padding: '4px 10px',
            }}>{product.badge}</div>
          )}

          {/* Quick add */}
          <button onClick={handleAdd} style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '14px',
            background: added ? '#00C896' : 'rgba(247,244,240,0.95)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            color: added ? '#fff' : 'var(--white)',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), background 0.3s',
          }}>
            {added ? '✓ Aggiunto' : '+ Aggiungi al Carrello'}
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 0 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <h3 style={{ fontSize: 13, fontWeight: 500 }}>{product.name}</h3>
            <span style={{
              fontSize: 14, fontWeight: 600,
              color: product.originalPrice ? 'var(--coral)' : 'var(--white)',
            }}>€{product.price}</span>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="9" height="9" viewBox="0 0 24 24"
                fill={i < Math.round(product.rating) ? 'var(--coral)' : 'none'}
                stroke="var(--coral)" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
            <span style={{ fontSize: 10, color: 'var(--white-dim)', marginLeft: 3 }}>({product.reviews})</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

import { useState } from 'react';
