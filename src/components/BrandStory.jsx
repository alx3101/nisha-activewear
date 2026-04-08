import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function CountUp({ target, suffix = '', ref: passedRef }) {
  return <span ref={passedRef}>{suffix}</span>;
}

export default function BrandStory() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const stat3Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal
      gsap.fromTo(imgRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      // Text side
      gsap.fromTo(textRef.current.children,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      // Parallax on image
      gsap.to(imgRef.current.querySelector('div img'),
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          }
        }
      );

      // Count up animations
      const countUps = [
        { el: stat1Ref.current, val: 10000, suffix: 'K+', display: '10' },
        { el: stat2Ref.current, val: 100, suffix: '%', display: '100' },
        { el: stat3Ref.current, val: 48, suffix: 'h', display: '48' },
      ];

      countUps.forEach(({ el, display, suffix }) => {
        let started = false;
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 60%',
          onEnter: () => {
            if (started) return;
            started = true;
            gsap.fromTo({ val: 0 }, { val: parseFloat(display) }, {
              duration: 1.8, ease: 'power2.out',
              onUpdate: function () {
                el.textContent = Math.round(this.targets()[0].val) + suffix;
              }
            });
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      padding: '140px 0',
      background: 'var(--black)',
      overflow: 'hidden',
    }}>
      <div className="container">
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 100, alignItems: 'center',
        }}>
          {/* Image side */}
          <div ref={imgRef} style={{ position: 'relative' }}>
            <div style={{ overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=90"
                alt="Nisha Brand Story"
                style={{
                  width: '100%', aspectRatio: '4/5',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            {/* Floating year card */}
            <div style={{
              position: 'absolute', bottom: -20, right: -20,
              background: 'var(--coral)', padding: '28px 32px',
              zIndex: 2,
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, lineHeight: 1, color: '#fff' }}>2021</div>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                La nostra storia
              </div>
            </div>
            {/* Decorative corner */}
            <div style={{
              position: 'absolute', top: -20, left: -20,
              width: 72, height: 72,
              border: '1.5px solid rgba(255,58,94,0.4)',
            }} />
          </div>

          {/* Text side */}
          <div ref={textRef}>
            <div style={{
              fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'var(--coral)', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 24, height: 1.5, background: 'var(--coral)' }} />
              La Nostra Storia
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 5.5vw, 76px)',
              lineHeight: 0.9, letterSpacing: '0.02em',
              marginBottom: 28,
            }}>
              NATA PER<br />
              <span style={{ color: 'var(--coral)' }}>DONNE</span><br />
              FORTI
            </h2>

            <p style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--white-dim)', fontWeight: 300, marginBottom: 20 }}>
              Nisha è nata dalla passione di una ragazza per lo sport e dall'insoddisfazione
              per i prodotti sul mercato: troppo basic, troppo cari, troppo poco stile.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--white-dim)', fontWeight: 300, marginBottom: 48 }}>
              Abbiamo creato tessuti{' '}
              <em style={{ fontFamily: 'var(--font-italic)', color: 'var(--white)', fontStyle: 'italic' }}>
                sculpt-fit
              </em>{' '}
              proprietari che si adattano al tuo corpo, ti supportano durante l'allenamento
              e ti fanno sentire bellissima anche dopo.
            </p>

            {/* Animated stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0,
              borderTop: '1px solid var(--border)',
            }}>
              {[
                { ref: stat1Ref, label: 'Queens', sub: 'nel mondo', initText: '10K+' },
                { ref: stat2Ref, label: 'Qualità', sub: 'garantita', initText: '100%' },
                { ref: stat3Ref, label: 'Delivery', sub: 'express', initText: '48h' },
              ].map(({ ref: r, label, sub, initText }) => (
                <div key={label} style={{
                  padding: '24px 0',
                  borderBottom: '1px solid var(--border)',
                  borderRight: label !== 'Delivery' ? '1px solid var(--border)' : 'none',
                  paddingRight: 20,
                  paddingLeft: label !== 'Queens' ? 20 : 0,
                }}>
                  <div
                    ref={r}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 38, color: 'var(--coral)',
                      lineHeight: 1,
                    }}
                  >{initText}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, marginTop: 6 }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--white-dim)' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section > div > div { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}
