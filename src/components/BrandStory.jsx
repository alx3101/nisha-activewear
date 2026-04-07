import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BrandStory() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(imgRef.current,
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      }
    );
    gsap.fromTo(textRef.current,
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} style={{
      padding: '120px 0',
      background: 'var(--black)',
      overflow: 'hidden',
    }}>
      <div className="container">
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 80, alignItems: 'center',
        }}>
          {/* Image side */}
          <div ref={imgRef} style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&q=85"
              alt="Nisha Brand Story"
              style={{
                width: '100%', aspectRatio: '4/5',
                objectFit: 'cover',
              }}
            />
            {/* Floating stat card */}
            <div style={{
              position: 'absolute', bottom: -24, right: -24,
              background: 'var(--coral)',
              padding: '24px 28px',
              minWidth: 160,
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 48, lineHeight: 1,
                color: 'var(--white)',
              }}>2021</div>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                Anno di Fondazione
              </div>
            </div>
            {/* Decorative line */}
            <div style={{
              position: 'absolute', top: -24, left: -24,
              width: 80, height: 80,
              border: '1px solid var(--border)',
            }} />
          </div>

          {/* Text side */}
          <div ref={textRef}>
            <div style={{
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--coral)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 24, height: 1, background: 'var(--coral)' }} />
              La Nostra Storia
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 5.5vw, 72px)',
              lineHeight: 0.92, letterSpacing: '0.02em',
              marginBottom: 28,
            }}>
              NATA PER<br />
              <span style={{ color: 'var(--coral)' }}>DONNE</span><br />
              FORTI
            </h2>

            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--white-dim)', fontWeight: 300, marginBottom: 20 }}>
              Nisha è nata dalla passione di una ragazza per lo sport e dall'insoddisfazione
              per i prodotti sul mercato. Troppo basic, troppo cari, troppo poco style.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--white-dim)', fontWeight: 300, marginBottom: 36 }}>
              Abbiamo creato tessuti <em style={{ fontFamily: 'var(--font-italic)', color: 'var(--white)' }}>sculpt-fit</em> proprietari che si adattano al tuo corpo,
              ti supportano durante l'allenamento e ti fanno sentire bellissima anche dopo.
              Perché non devi scegliere tra performance e stile.
            </p>

            {/* Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { num: '10K+', label: 'Queens', sub: 'nel mondo' },
                { num: '100%', label: 'Qualità', sub: 'garantita' },
                { num: '48h', label: 'Express', sub: 'delivery' },
              ].map(({ num, label, sub }) => (
                <div key={label} style={{
                  padding: '20px 0',
                  borderTop: '1px solid var(--border)',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--coral)' }}>{num}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--white-dim)' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section > div > div { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
