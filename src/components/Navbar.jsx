import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useCart } from '../context/CartContext';

const NAV_CATS = [
  { label: 'New In',   to: '/shop?cat=all',      items: [] },
  {
    label: 'Sets',
    to: '/shop?cat=sets',
    items: [
      { label: 'Tutti i Sets',    to: '/shop?cat=sets' },
      { label: 'Coordinati',      to: '/shop?cat=sets' },
      { label: 'Matching Set',    to: '/shop?cat=sets' },
    ],
  },
  {
    label: 'Leggings',
    to: '/shop?cat=leggings',
    items: [
      { label: 'Tutti i Leggings', to: '/shop?cat=leggings' },
      { label: 'Alto Vita',        to: '/shop?cat=leggings' },
      { label: 'Modellanti',       to: '/shop?cat=leggings' },
    ],
  },
  {
    label: 'Tops',
    to: '/shop?cat=tops',
    items: [
      { label: 'Tutti i Tops',   to: '/shop?cat=tops' },
      { label: 'Sport Bra',      to: '/shop?cat=tops' },
      { label: 'Tank Top',       to: '/shop?cat=tops' },
    ],
  },
  { label: 'Sale',     to: '/shop',              items: [], highlight: true },
];

export default function Navbar() {
  const { count, setIsOpen }   = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal]   = useState('');
  const navRef      = useRef(null);
  const drawerRef   = useRef(null);
  const megaRef     = useRef(null);
  const searchRef   = useRef(null);
  const location    = useLocation();
  const navigate    = useNavigate();
  const closeTimer  = useRef(null);

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80 },
      { y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1, overwrite: true }
    );
  }, []);

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false);
    setActiveMenu(null);
    setSearchOpen(false);
  }, [location]);

  // Mobile drawer animation
  useEffect(() => {
    if (!drawerRef.current) return;
    gsap.to(drawerRef.current, {
      x: menuOpen ? 0 : '100%',
      duration: 0.4,
      ease: menuOpen ? 'power3.out' : 'power3.in',
    });
  }, [menuOpen]);

  // Mega-menu animation
  useEffect(() => {
    if (!megaRef.current) return;
    if (activeMenu !== null) {
      gsap.fromTo(megaRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out', overwrite: true }
      );
    } else {
      gsap.to(megaRef.current, { opacity: 0, y: -8, duration: 0.18, ease: 'power2.in', overwrite: true });
    }
  }, [activeMenu]);

  // Search input focus
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  const handleMouseEnter = (idx) => {
    clearTimeout(closeTimer.current);
    setActiveMenu(idx);
  };
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop`);
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  const isHome  = location.pathname === '/';
  const solid   = scrolled || menuOpen || activeMenu !== null || !isHome;
  const bg      = solid ? 'rgba(247,244,240,0.98)' : 'transparent';
  // White text only on home page over dark hero; dark text on all other pages
  const textColor = (!solid && isHome) ? 'rgba(255,255,255,0.92)' : '#1A1410';

  return (
    <>
      {/* ── Announcement bar ──
           Home:        dark bg + light text (sits above dark hero photo)
           Other pages: cream bg + dark text (blends with the navbar below it)
      ── */}
      <div className="announce-bar" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001,
        background: isHome ? '#1A1410' : 'rgba(247,244,240,0.98)',
        borderBottom: isHome ? 'none' : '1px solid var(--border)',
        height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: isHome ? 'rgba(255,255,255,0.75)' : 'var(--white-dim)',
        backdropFilter: isHome ? 'none' : 'blur(20px)',
        transition: 'background 0.35s, color 0.35s',
        overflow: 'hidden',
      }}>
        <span className="announce-full">Spedizione gratuita per ordini superiori a €80 &nbsp;·&nbsp; Resi gratuiti 30 giorni</span>
        <span className="announce-short">Spedizione gratuita sopra €80 · Reso 30gg</span>
      </div>

      {/* ── Main nav ── */}
      <nav ref={navRef} style={{
        position: 'fixed', top: 34, left: 0, right: 0,
        zIndex: 1000,
        background: bg,
        backdropFilter: solid ? 'blur(20px)' : 'none',
        borderBottom: solid ? '1px solid var(--border)' : 'none',
        transition: 'background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
      }}>
        <div style={{
          maxWidth: 1440, margin: '0 auto',
          padding: scrolled ? '0 48px' : '0 48px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'stretch',
          height: scrolled ? 56 : 68,
          transition: 'height 0.35s ease',
        }}>

          {/* ── Left: categories ── */}
          <div className="nav-cats" style={{ display: 'flex', alignItems: 'stretch' }}>
            {NAV_CATS.map((cat, idx) => (
              <div
                key={cat.label}
                style={{ position: 'relative', display: 'flex', alignItems: 'stretch' }}
                onMouseEnter={() => cat.items.length ? handleMouseEnter(idx) : undefined}
                onMouseLeave={() => cat.items.length ? handleMouseLeave() : undefined}
              >
                <Link
                  to={cat.to}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '0 16px',
                    fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: cat.highlight ? 'var(--coral)' : textColor,
                    borderBottom: activeMenu === idx ? '2px solid var(--coral)' : '2px solid transparent',
                    transition: 'color 0.2s, border-color 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!cat.highlight) e.currentTarget.style.color = 'var(--coral)'; }}
                  onMouseLeave={e => { if (!cat.highlight) e.currentTarget.style.color = textColor; }}
                >
                  {cat.label}
                </Link>
              </div>
            ))}
          </div>

          {/* ── Center: logo ── */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: scrolled ? 22 : 26,
              letterSpacing: '0.3em',
              color: 'var(--white)',
              transition: 'font-size 0.35s ease',
            }}>
              NISHA
            </span>
          </Link>

          {/* ── Right: icons ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
            {/* Search */}
            <button
              className="nav-search-btn"
              onClick={() => setSearchOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'none', border: 'none', color: textColor, transition: 'color 0.2s' }}
              aria-label="Cerca"
              onMouseEnter={e => e.currentTarget.style.color = 'var(--coral)'}
              onMouseLeave={e => e.currentTarget.style.color = textColor}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* Wishlist */}
            <button
              className="nav-wishlist-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'none', border: 'none', color: textColor, transition: 'color 0.2s' }}
              aria-label="Lista desideri"
              onMouseEnter={e => e.currentTarget.style.color = 'var(--coral)'}
              onMouseLeave={e => e.currentTarget.style.color = textColor}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>

            {/* Cart */}
            <button
              className="nav-cart-btn"
              onClick={() => setIsOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'none', border: '1px solid var(--border)', color: textColor, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.2s', position: 'relative', marginLeft: 8 }}
              aria-label="Carrello"
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = textColor; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span className="nav-cart-label">Carrello</span>
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  background: 'var(--coral)', color: '#fff',
                  borderRadius: '50%', width: 18, height: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700,
                }}>
                  {count}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="hamburger"
              onClick={() => setMenuOpen(o => !o)}
              style={{ display: 'none', flexDirection: 'column', gap: 5, padding: 8, background: 'none', border: 'none', color: textColor, marginLeft: 4 }}
              aria-label="Menu"
            >
              <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px,4px)' : 'none' }} />
              <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* ── Mega-menu dropdown ── */}
        <div
          ref={megaRef}
          onMouseEnter={() => clearTimeout(closeTimer.current)}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'rgba(247,244,240,0.99)',
            backdropFilter: 'blur(20px)',
            borderBottom: (activeMenu !== null && NAV_CATS[activeMenu]?.items.length) ? '1px solid var(--border)' : 'none',
            padding: activeMenu !== null && NAV_CATS[activeMenu]?.items.length ? '28px 48px 32px' : 0,
            maxHeight: activeMenu !== null && NAV_CATS[activeMenu]?.items.length ? 200 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.3s ease, padding 0.3s ease',
            opacity: 0,
            pointerEvents: activeMenu !== null ? 'auto' : 'none',
          }}
        >
          {activeMenu !== null && NAV_CATS[activeMenu]?.items.length > 0 && (
            <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: 16 }}>
                  {NAV_CATS[activeMenu].label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {NAV_CATS[activeMenu].items.map(item => (
                    <Link key={item.label} to={item.to} style={{ fontSize: 14, color: 'var(--white-dim)', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--coral)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--white-dim)'}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch', margin: '0 8px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: 16 }}>Popolari ora</div>
                <Link to={NAV_CATS[activeMenu].to} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--coral)', fontWeight: 600 }}>
                  Vedi Tutti
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Search bar ── */}
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(247,244,240,0.99)',
          backdropFilter: 'blur(20px)',
          borderBottom: searchOpen ? '1px solid var(--border)' : 'none',
          maxHeight: searchOpen ? 80 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
          pointerEvents: searchOpen ? 'auto' : 'none',
          zIndex: 10,
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', padding: '0 48px', height: 80 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--white-dim)" strokeWidth="1.6" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              ref={searchRef}
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Cerca prodotti..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'none',
                fontSize: 18, fontFamily: 'var(--font-body)',
                color: 'var(--white)', padding: '0 16px',
              }}
            />
            <button type="button" onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--white-dim)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
          </form>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div ref={drawerRef} style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '85vw', maxWidth: 360,
        background: 'var(--black)',
        borderLeft: '1px solid var(--border)',
        zIndex: 1099,
        transform: 'translateX(100%)',
        padding: '110px 32px 48px',
        display: 'flex', flexDirection: 'column', gap: 0,
        overflowY: 'auto',
      }}>
        {NAV_CATS.map(({ to, label, highlight }) => (
          <Link key={label} to={to} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32, letterSpacing: '0.04em',
            color: highlight ? 'var(--coral)' : 'var(--white)',
            display: 'block', padding: '13px 0',
            borderBottom: '1px solid var(--border)',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--coral)'}
            onMouseLeave={e => e.currentTarget.style.color = highlight ? 'var(--coral)' : 'var(--white)'}
          >
            {label}
          </Link>
        ))}

        <button onClick={() => { setIsOpen(true); setMenuOpen(false); }} style={{
          marginTop: 32,
          padding: '16px', background: 'var(--coral)', color: '#fff',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Carrello {count > 0 && `(${count})`}
        </button>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(26,20,16,0.55)',
          backdropFilter: 'blur(4px)', zIndex: 1098,
        }} />
      )}

      <style>{`
        .announce-short { display: none; }

        @media (max-width: 900px) {
          /* visibility:hidden keeps the 1fr grid column so the logo stays centered */
          .nav-cats { visibility: hidden !important; pointer-events: none !important; overflow: hidden !important; }
          .hamburger { display: flex !important; }
          .nav-cart-label { display: none; }
          .nav-cart-btn {
            padding: 8px !important;
            border: none !important;
            margin-left: 0 !important;
          }
          .nav-search-btn { display: none !important; }
          .nav-wishlist-btn { display: none !important; }
          nav > div { padding: 0 20px !important; }
        }
        @media (max-width: 600px) {
          .announce-full  { display: none; }
          .announce-short { display: inline; }
          .announce-bar   { letter-spacing: 0.1em !important; font-size: 9px !important; }
        }
        @media (max-width: 480px) {
          nav > div { padding: 0 16px !important; }
        }
      `}</style>
    </>
  );
}
