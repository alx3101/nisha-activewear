import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const collections = [
  {
    name: 'Sets',
    tag: 'sets',
    label: 'La coppia perfetta',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
    size: 'large',
  },
  {
    name: 'Leggings',
    tag: 'leggings',
    label: 'Push-up & Sculpt',
    image: 'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=800&q=80',
    size: 'small',
  },
  {
    name: 'Tops',
    tag: 'tops',
    label: 'Sport & Style',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    size: 'small',
  },
];

export default function Collections() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    );

    cardsRef.current.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.9, ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: '120px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div ref={headerRef} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: 48,
        }}>
          <div>
            <div style={{
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--coral)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 24, height: 1, background: 'var(--coral)' }} />
              Le Nostre Categorie
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 7vw, 96px)',
              lineHeight: 0.9,
              letterSpacing: '0.02em',
            }}>
              SHOP<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(26,20,16,0.3)' }}>BY LOOK</span>
            </h2>
          </div>
          <Link to="/shop" style={{
            fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--white-dim)', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'color 0.2s',
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

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: 16,
        }}>
          {/* Large card */}
          <div ref={el => cardsRef.current[0] = el} style={{ gridRow: '1 / 3' }}>
            <CollectionCard collection={collections[0]} height="680px" />
          </div>
          {/* Two small cards */}
          {collections.slice(1).map((col, i) => (
            <div key={col.name} ref={el => cardsRef.current[i + 1] = el}>
              <CollectionCard collection={col} height="332px" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div > div:last-child {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
          }
          section > div > div:last-child > div:first-child {
            grid-row: auto !important;
          }
        }
      `}</style>
    </section>
  );
}

function CollectionCard({ collection, height }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/shop?cat=${collection.tag}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        height,
      }}
    >
      <img
        src={collection.image}
        alt={collection.name}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(26,20,16,0.8) 0%, rgba(26,20,16,0.2) 50%, transparent 100%)',
        transition: 'opacity 0.3s',
        opacity: hovered ? 0.9 : 0.7,
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', bottom: 28, left: 28, right: 28,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.15em', color: 'var(--white-dim)', textTransform: 'uppercase', marginBottom: 6 }}>
            {collection.label}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 4vw, 56px)',
            letterSpacing: '0.05em',
            lineHeight: 1,
            color: 'var(--white)',
          }}>{collection.name.toUpperCase()}</h3>
        </div>
        <div style={{
          width: 44, height: 44,
          border: '1px solid var(--white)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s',
          background: hovered ? 'var(--coral)' : 'transparent',
          borderColor: hovered ? 'var(--coral)' : 'var(--white)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}

// useState import needed
import { useState } from 'react';
