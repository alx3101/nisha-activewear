import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  { text: 'SIAMO', coral: false },
  { text: 'FATTE', coral: false },
  { text: 'PER', coral: false },
  { text: 'MUOVERCI,', coral: true },
  { text: 'PER', coral: false },
  { text: 'BRILLARE,', coral: true },
  { text: 'PER', coral: false },
  { text: 'NON', coral: false },
  { text: 'FERMARCI', coral: true },
  { text: 'MAI.', coral: false },
];

export default function Manifesto() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const wordRefs = useRef([]);

  useEffect(() => {
    // Parallax on the background image
    gsap.to(imgRef.current, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    // Clip-path reveal on section enter
    gsap.fromTo(imgRef.current,
      { opacity: 0, scale: 1.05 },
      {
        opacity: 1, scale: 1,
        duration: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        }
      }
    );

    // Word highlight on scroll
    wordRefs.current.forEach((word, i) => {
      gsap.fromTo(word,
        { opacity: 0.15 },
        {
          opacity: 1,
          color: word.dataset.coral === 'true' ? 'var(--coral)' : 'var(--white)',
          duration: 0.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${i * 60} center`,
            end: `top+=${i * 60 + 60} center`,
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section ref={sectionRef} style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      overflow: 'hidden',
    }}>
      {/* Left — text */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '120px 64px',
        background: 'var(--black)',
        position: 'relative', zIndex: 1,
      }}>
        <div>
          <div style={{
            fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--coral)', marginBottom: 40,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 28, height: 1.5, background: 'var(--coral)' }} />
            Il Nostro Manifesto
          </div>

          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 5.5vw, 80px)',
            lineHeight: 1.05,
            letterSpacing: '0.02em',
          }}>
            {WORDS.map((w, i) => (
              <span key={i}>
                <span
                  ref={el => wordRefs.current[i] = el}
                  data-coral={w.coral}
                  style={{
                    display: 'inline-block',
                    opacity: 0.15,
                    color: 'var(--white)',
                    transition: 'color 0.3s',
                  }}
                >
                  {w.text}
                </span>
                {' '}
              </span>
            ))}
          </div>

          <div style={{ marginTop: 52, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--white-dim)', fontWeight: 300, maxWidth: 380 }}>
              Ogni capo Nisha è costruito attorno al tuo corpo, al tuo movimento,
              alla tua forza. Non abbigliamento sportivo:{' '}
              <em style={{ fontFamily: 'var(--font-italic)', color: 'var(--white)' }}>
                la tua seconda pelle.
              </em>
            </p>
          </div>
        </div>
      </div>

      {/* Right — image */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 600 }}>
        <img
          ref={imgRef}
          src="https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=900&q=90"
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '120%',
            objectFit: 'cover', objectPosition: 'center top',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(247,244,240,0.15) 0%, transparent 40%)',
        }} />
        {/* Overlay quote */}
        <div style={{
          position: 'absolute', bottom: 48, left: 40, right: 40,
          padding: '24px 28px',
          background: 'rgba(247,244,240,0.9)',
          backdropFilter: 'blur(12px)',
          borderLeft: '3px solid var(--coral)',
        }}>
          <p style={{
            fontFamily: 'var(--font-italic)', fontStyle: 'italic',
            fontSize: 18, lineHeight: 1.5,
            color: 'var(--white)',
          }}>
            "Il miglior allenamento è quello in cui ti senti bellissima."
          </p>
          <p style={{ fontSize: 11, color: 'var(--white-dim)', marginTop: 8, letterSpacing: '0.1em' }}>
            — NISHA TEAM
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section { grid-template-columns: 1fr !important; }
          section > div:last-child { min-height: 400px !important; }
        }
      `}</style>
    </section>
  );
}
