import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--dark)',
      borderTop: '1px solid var(--border)',
      padding: '80px 0 32px',
    }}>
      <div className="container">
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 60, marginBottom: 64,
        }}>
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36, letterSpacing: '0.25em',
              marginBottom: 20,
            }}>NISHA</div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--white-dim)', fontWeight: 300, maxWidth: 280, marginBottom: 24 }}>
              Abbigliamento sportivo premium per donne che non si fermano mai.
              Move like a queen.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { icon: 'instagram', href: '#' },
                { icon: 'tiktok', href: '#' },
              ].map(({ icon, href }) => (
                <a key={icon} href={href} target="_blank" rel="noopener noreferrer" style={{
                  width: 36, height: 36,
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--white-dim)',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--white-dim)'; }}
                >
                  {icon === 'instagram' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                    </svg>
                  )}
                  {icon === 'tiktok' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.01a8.16 8.16 0 004.77 1.52V7.08a4.85 4.85 0 01-1-.39z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, color: 'var(--white)' }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Tutti i Prodotti', to: '/shop' },
                { label: 'Sets', to: '/shop?cat=sets' },
                { label: 'Leggings', to: '/shop?cat=leggings' },
                { label: 'Tops', to: '/shop?cat=tops' },
                { label: 'New In', to: '/shop?new=true' },
              ].map(({ label, to }) => (
                <Link key={label} to={to} style={{
                  fontSize: 14, color: 'var(--white-dim)', fontWeight: 300,
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--white)'}
                  onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Supporto */}
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, color: 'var(--white)' }}>Supporto</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Contattaci', 'Guida alle Taglie', 'FAQ', 'Spedizioni & Resi', 'Traccia il Tuo Ordine'].map(item => (
                <a key={item} href="#" style={{
                  fontSize: 14, color: 'var(--white-dim)', fontWeight: 300,
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--white)'}
                  onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, color: 'var(--white)' }}>Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</div>
                <a href="mailto:info@nishaactivewear.com" style={{ fontSize: 14, color: 'var(--white)', fontWeight: 300, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--coral)'}
                  onMouseLeave={e => e.target.style.color = 'var(--white)'}
                >
                  info@nishaactivewear.com
                </a>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Orari Supporto</div>
                <div style={{ fontSize: 14, color: 'var(--white)', fontWeight: 300 }}>Lun–Ven 9:00–18:00</div>
              </div>
              <div style={{
                padding: '12px', background: 'var(--coral-dim)',
                border: '1px solid rgba(255,58,94,0.2)',
              }}>
                <div style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 600, letterSpacing: '0.1em' }}>🚚 SPEDIZIONE GRATIS</div>
                <div style={{ fontSize: 12, color: 'var(--white-dim)', marginTop: 2 }}>Su ordini superiori a €50</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ fontSize: 12, color: 'var(--white-dim)' }}>
            © 2025 Nisha Activewear. Tutti i diritti riservati.
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Cookie Policy', 'Termini e Condizioni'].map(item => (
              <a key={item} href="#" style={{
                fontSize: 12, color: 'var(--white-dim)',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--white)'}
                onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 600px) {
          footer > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
