import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav ref={navRef} style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: scrolled ? '14px 48px' : '24px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,8,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.4s var(--ease)',
      }}>
        {/* Left links */}
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          <Link to="/shop" style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--white)'}
            onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}>
            Shop
          </Link>
          <Link to="/shop?cat=sets" style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--white)'}
            onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}>
            Sets
          </Link>
          <Link to="/shop?cat=leggings" style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--white)'}
            onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}>
            Leggings
          </Link>
        </div>

        {/* Logo */}
        <Link to="/" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26, letterSpacing: '0.25em',
            color: 'var(--white)',
          }}>NISHA</span>
        </Link>

        {/* Right */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link to="/shop?cat=tops" style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--white)'}
            onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}>
            Tops
          </Link>

          {/* Cart */}
          <button onClick={() => setIsOpen(true)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--white)', padding: '8px 16px',
            border: '1px solid var(--border)',
            borderRadius: 2, transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--white)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && (
              <span style={{
                background: 'var(--coral)', color: 'var(--white)',
                borderRadius: '50%', width: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600, marginLeft: -4,
              }}>{count}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile nav — simplified */}
      <style>{`
        @media (max-width: 768px) {
          nav { padding: 16px 20px !important; }
          nav > div:first-child { display: none !important; }
          nav > div:last-child > a { display: none !important; }
        }
      `}</style>
    </>
  );
}
