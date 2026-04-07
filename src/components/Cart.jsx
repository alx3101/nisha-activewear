import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeItem, updateQty, total, isOpen, setIsOpen } = useCart();
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.3 });
      gsap.to(drawerRef.current, { x: 0, duration: 0.5, ease: 'power3.out' });
    } else {
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3 });
      gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,20,16,0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000, opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Drawer */}
      <div ref={drawerRef} style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 420,
        background: 'var(--dark)',
        borderLeft: '1px solid var(--border)',
        zIndex: 2001,
        transform: 'translateX(100%)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '28px 32px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0,
          background: 'var(--dark)', zIndex: 1,
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.1em' }}>
              CARRELLO
            </h2>
            <div style={{ fontSize: 12, color: 'var(--white-dim)' }}>
              {items.length} {items.length === 1 ? 'articolo' : 'articoli'}
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} style={{
            width: 36, height: 36,
            border: '1px solid var(--border)',
            color: 'var(--white)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--coral)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, padding: '0 32px' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: 300, gap: 16,
            }}>
              <div style={{ fontSize: 48 }}>🛍️</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>Il carrello è vuoto</div>
              <div style={{ fontSize: 13, color: 'var(--white-dim)', textAlign: 'center' }}>
                Aggiungi qualcosa di bello per iniziare!
              </div>
              <button onClick={() => setIsOpen(false)} style={{
                padding: '12px 28px',
                background: 'var(--coral)',
                color: 'var(--white)',
                fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                fontWeight: 600,
              }}>
                Continua lo Shopping
              </button>
            </div>
          ) : (
            <div style={{ paddingTop: 20 }}>
              {items.map(item => (
                <CartItem key={item.key} item={item} removeItem={removeItem} updateQty={updateQty} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '24px 32px 32px',
            borderTop: '1px solid var(--border)',
            position: 'sticky', bottom: 0,
            background: 'var(--dark)',
          }}>
            {/* Shipping bar */}
            <div style={{ marginBottom: 20 }}>
              {total >= 50 ? (
                <div style={{
                  fontSize: 12, color: '#00C896',
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                }}>
                  <span>✓</span> Spedizione gratuita sbloccata!
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--white-dim)', marginBottom: 8 }}>
                  Aggiungi <strong style={{ color: 'var(--white)' }}>€{(50 - total).toFixed(2)}</strong> per la spedizione gratuita
                </div>
              )}
              <div style={{ height: 3, background: 'var(--dark-2)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (total / 50) * 100)}%`,
                  background: 'var(--coral)',
                  borderRadius: 2, transition: 'width 0.5s ease',
                }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: 'var(--white-dim)' }}>Subtotale</span>
              <span style={{ fontSize: 16, fontWeight: 600 }}>€{total.toFixed(2)}</span>
            </div>

            <button style={{
              width: '100%', padding: '18px',
              background: 'var(--coral)',
              color: 'var(--white)',
              fontSize: 12, fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Procedi al Checkout — €{total.toFixed(2)}
            </button>
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12,
              opacity: 0.5,
            }}>
              {['VISA', 'MC', 'PAYPAL', 'AMEX'].map(p => (
                <span key={p} style={{ fontSize: 9, letterSpacing: '0.1em', border: '1px solid var(--border)', padding: '2px 6px' }}>{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 480px) {
          div[style*="width: 420px"] { width: 100vw !important; }
        }
      `}</style>
    </>
  );
}

function CartItem({ item, removeItem, updateQty }) {
  return (
    <div style={{
      display: 'flex', gap: 16, paddingBottom: 20, marginBottom: 20,
      borderBottom: '1px solid var(--border)',
    }}>
      <img
        src={item.image}
        alt={item.name}
        style={{ width: 80, height: 100, objectFit: 'cover', flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{item.name}</div>
        <div style={{ fontSize: 11, color: 'var(--white-dim)', marginBottom: 12 }}>
          Taglia: {item.size} · {item.color}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)' }}>
            <button
              onClick={() => updateQty(item.key, -1)}
              style={{
                width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: 'var(--white)',
                transition: 'color 0.2s',
              }}
            >−</button>
            <span style={{ width: 32, textAlign: 'center', fontSize: 13 }}>{item.qty}</span>
            <button
              onClick={() => updateQty(item.key, 1)}
              style={{
                width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: 'var(--white)',
                transition: 'color 0.2s',
              }}
            >+</button>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>€{(item.price * item.qty).toFixed(2)}</div>
        </div>
      </div>
      <button onClick={() => removeItem(item.key)} style={{
        color: 'var(--white-dim)', alignSelf: 'flex-start',
        padding: 4, transition: 'color 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--coral)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--white-dim)'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}
