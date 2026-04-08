import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reviews } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

function Stars({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < rating ? 'var(--coral)' : 'none'}
          stroke="var(--coral)" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function SocialProof() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      }
    );
  }, []);

  const next = () => setActive(a => (a + 1) % reviews.length);
  const prev = () => setActive(a => (a - 1 + reviews.length) % reviews.length);

  return (
    <section ref={sectionRef} style={{
      padding: '120px 0',
      background: 'var(--black)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background number */}
      <div style={{
        position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)',
        fontSize: '40vw',
        color: 'rgba(255,58,94,0.06)',
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>4.9</div>

      <div className="container">
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: 80 }}>
          {/* Overall rating */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 20 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(80px, 12vw, 140px)',
              lineHeight: 1,
              color: 'var(--white)',
            }}>4.9</div>
            <div style={{ paddingBottom: 12 }}>
              <Stars rating={5} size={20} />
              <div style={{ fontSize: 13, color: 'var(--white-dim)', marginTop: 8 }}>
                Basato su <strong style={{ color: 'var(--white)' }}>699+ recensioni verificate</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--coral)', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 24, height: 1, background: 'var(--coral)' }} />
              Cosa Dicono di Noi
            </div>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 6vw, 80px)',
            lineHeight: 0.9, letterSpacing: '0.02em', marginTop: 12,
          }}>
            CLIENTI<br />
            <span style={{ color: 'var(--coral)' }}>SODDISFATTE</span>
          </h2>
        </div>

        {/* Rating bars */}
        <div className="sp-grid" style={{
          display: 'grid', gridTemplateColumns: '280px 1fr',
          gap: 80, alignItems: 'start',
        }}>
          <div>
            <div style={{ marginBottom: 24 }}>
              {[5, 4, 3, 2, 1].map((star, i) => {
                const pct = [78, 15, 5, 1, 1][i];
                return (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: 'var(--white-dim)', width: 8 }}>{star}</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--coral)" stroke="var(--coral)" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <div style={{ flex: 1, height: 4, background: 'var(--dark-2)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: 'var(--coral)', borderRadius: 2,
                        transition: 'width 1.5s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--white-dim)', width: 32, textAlign: 'right' }}>{pct}%</span>
                  </div>
                );
              })}
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              {[
                { icon: '✓', text: 'Recensioni Verificate' },
                { icon: '🔒', text: 'Acquisti Protetti' },
                { icon: '↩', text: 'Reso Gratuito 30gg' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--white-dim)' }}>
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews carousel */}
          <div>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: 280,
            }}>
              <ReviewCard review={reviews[active]} key={active} />
            </div>

            {/* Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 32 }}>
              <button onClick={prev} style={{
                width: 44, height: 44,
                border: '1px solid var(--border)',
                color: 'var(--white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--white)'; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>

              <div style={{ display: 'flex', gap: 6 }}>
                {reviews.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)} style={{
                    width: i === active ? 24 : 6, height: 6,
                    background: i === active ? 'var(--coral)' : 'var(--border)',
                    borderRadius: 3, border: 'none',
                    transition: 'all 0.3s',
                  }} />
                ))}
              </div>

              <button onClick={next} style={{
                width: 44, height: 44,
                border: '1px solid var(--border)',
                color: 'var(--white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--white)'; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sp-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

function ReviewCard({ review }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  return (
    <div ref={ref} style={{
      background: 'var(--dark)',
      border: '1px solid var(--border)',
      padding: 36,
    }}>
      {/* Quote */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 80, lineHeight: 0.7,
        color: 'var(--coral)', opacity: 0.4,
        marginBottom: 8,
      }}>"</div>

      <Stars rating={review.rating} />

      <p style={{
        fontSize: 16, lineHeight: 1.7,
        color: 'var(--white)',
        marginTop: 16, marginBottom: 24,
        fontWeight: 300,
      }}>
        {review.text}
      </p>

      {/* Product tag */}
      <div style={{
        display: 'inline-block',
        background: 'var(--coral-dim)',
        color: 'var(--coral)',
        fontSize: 10, letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '4px 10px',
        marginBottom: 20,
      }}>
        {review.product}
      </div>

      {/* Reviewer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
        <img
          src={review.avatar}
          alt={review.name}
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>
            {review.name}
            {review.verified && (
              <span style={{ marginLeft: 6, fontSize: 10, color: '#00C896', letterSpacing: '0.1em' }}>✓ VERIFICATA</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--white-dim)' }}>{review.location} · {review.date}</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--white-dim)' }}>
          👍 {review.helpful} utili
        </div>
      </div>
    </div>
  );
}
