import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef    = useRef(null);
  const drawerRef = useRef(null);
  const location  = useLocation();

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -60 },
      { y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1, overwrite: true }
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

  // Animate mobile drawer
  useEffect(() => {
    if (!drawerRef.current) return;
    gsap.to(drawerRef.current, {
      x: menuOpen ? 0 : '100%',
      duration: 0.45,
      ease: menuOpen ? 'power3.out' : 'power3.in',
    });
  }, [menuOpen]);

  const navBg = scrolled || menuOpen
    ? 'rgba(247,244,240,0.97)'
    : 'transparent';

  return (
    <>
      <nav ref={navRef} style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: scrolled ? '14px 48px' : '22px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: navBg,
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}>

        {/* Desktop links left */}
        <div className="nav-links" style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {[
            { to: '/shop', label: 'Shop' },
            { to: '/shop?cat=sets', label: 'Sets' },
            { to: '/shop?cat=leggings', label: 'Leggings' },
          ].map(({ to, label }) => (
            <Link key={label} to={to} style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--white-dim)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--white)'}
              onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}
            >{label}</Link>
          ))}
        </div>

        {/* Logo — always centered */}
        <Link to="/" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.28em', color: 'var(--white)' }}>
            NISHA
          </span>
        </Link>

        {/* Right */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link to="/shop?cat=tops" className="nav-links" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--white-dim)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--white)'}
            onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}
          >Tops</Link>

          {/* Cart */}
          <button onClick={() => setIsOpen(true)} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--white)', padding: '8px 16px',
            border: '1px solid var(--border)',
            background: 'none',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--white)'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && (
              <span style={{ background: 'var(--coral)', color: '#fff', borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, marginLeft: -2 }}>
                {count}
              </span>
            )}
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{ display: 'none', flexDirection: 'column', gap: 5, padding: 4, background: 'none', border: 'none', color: 'var(--white)' }}
            aria-label="Menu"
          >
            <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px,4px)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div ref={drawerRef} style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '80vw', maxWidth: 320,
        background: 'var(--black)',
        borderLeft: '1px solid var(--border)',
        zIndex: 999,
        transform: 'translateX(100%)',
        padding: '100px 32px 48px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {[
          { to: '/', label: 'Home' },
          { to: '/shop', label: 'Shop All' },
          { to: '/shop?cat=sets', label: 'Sets' },
          { to: '/shop?cat=leggings', label: 'Leggings' },
          { to: '/shop?cat=tops', label: 'Tops' },
        ].map(({ to, label }) => (
          <Link key={label} to={to} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36, letterSpacing: '0.05em',
            color: 'var(--white)', display: 'block', padding: '8px 0',
            borderBottom: '1px solid var(--border)',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--coral)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--white)'}
          >{label}</Link>
        ))}
        <button onClick={() => { setIsOpen(true); setMenuOpen(false); }} style={{
          marginTop: 'auto',
          padding: '16px', background: 'var(--coral)', color: '#fff',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
          border: 'none',
        }}>
          Carrello {count > 0 && `(${count})`}
        </button>
      </div>

      {/* Overlay when menu open */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(26,20,16,0.5)',
          backdropFilter: 'blur(4px)', zIndex: 998,
        }} />
      )}

      <style>{`
        @media (max-width: 768px) {
          nav { padding: 16px 20px !important; }
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
          nav button[style*="padding: 8px 16px"] span:not([style*="background: var(--coral)"]) { display: none; }
        }
      `}</style>
    </>
  );
}
