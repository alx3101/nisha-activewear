import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from './ProductCard';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProducts() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      }
    );

    const cards = gridRef.current.children;
    gsap.fromTo(cards,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' }
      }
    );
  }, []);

  const featured = products.filter(p => p.featured);

  return (
    <section ref={sectionRef} style={{ padding: '80px 0 120px', background: 'var(--dark)' }}>
      <div className="container">
        <div ref={headerRef} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: 52,
        }}>
          <div>
            <div style={{
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--coral)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 24, height: 1, background: 'var(--coral)' }} />
              I Più Amati
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 6vw, 80px)',
              lineHeight: 0.9, letterSpacing: '0.02em',
            }}>
              BESTSELLER<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(242,237,232,0.4)' }}>COLLECTION</span>
            </h2>
          </div>
          <Link to="/shop" style={{
            fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '12px 28px',
            border: '1px solid var(--border)',
            color: 'var(--white-dim)',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--white-dim)'; }}
          >
            Vedi Tutto
          </Link>
        </div>

        <div ref={gridRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}>
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          section > div > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          section > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
