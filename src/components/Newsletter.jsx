import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Newsletter() {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    gsap.fromTo(innerRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      }
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section ref={sectionRef} style={{
      padding: '0 0 120px',
      background: 'var(--black)',
    }}>
      <div className="container">
        <div ref={innerRef} style={{
          background: 'var(--coral)',
          padding: '80px 80px',
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
        }}>
          {/* Background text */}
          <div style={{
            position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)',
            fontFamily: 'var(--font-display)',
            fontSize: '25vw', lineHeight: 1,
            color: 'rgba(26,20,16,0.06)',
            pointerEvents: 'none', userSelect: 'none',
          }}>N</div>

          {/* Left */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)', marginBottom: 16,
            }}>
              Newsletter Esclusiva
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 5vw, 72px)',
              lineHeight: 0.9, letterSpacing: '0.02em',
              color: 'var(--white)',
              marginBottom: 20,
            }}>
              -10% SUL<br />PRIMO ORDINE
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', fontWeight: 300 }}>
              Iscriviti e ricevi subito un coupon del 10% + accesso anticipato
              alle nuove collezioni e offerte esclusive per le Nisha Queens.
            </p>
          </div>

          {/* Right - form */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <input
                    type="email"
                    placeholder="La tua email..."
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'var(--white)',
                      fontSize: 15, fontWeight: 300,
                      outline: 'none',
                    }}
                  />
                </div>
                <button type="submit" style={{
                  width: '100%',
                  padding: '18px',
                  background: 'var(--white)',
                  color: 'var(--coral)',
                  fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  border: 'none',
                  transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--black)'; e.currentTarget.style.color = 'var(--coral)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--coral)'; }}
                >
                  Ottieni il -10% →
                </button>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 10, textAlign: 'center' }}>
                  Niente spam. Puoi disiscriverti quando vuoi.
                </p>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 64, color: 'var(--white)', marginBottom: 12,
                }}>✓</div>
                <h3 style={{ fontSize: 22, fontWeight: 600, color: 'var(--white)', marginBottom: 8 }}>
                  Benvenuta nel club, Queen!
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                  Controlla la tua email per il codice sconto.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section > div > div { grid-template-columns: 1fr !important; padding: 48px 32px !important; }
        }
      `}</style>
    </section>
  );
}
