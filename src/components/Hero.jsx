import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const imgRef = useRef(null);
  const overlayRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.8 });

    // Image reveal
    tl.fromTo(imgRef.current,
      { scale: 1.15, filter: 'brightness(0)' },
      { scale: 1, filter: 'brightness(0.55)', duration: 1.8, ease: 'power3.out' }
    )
    // Text lines cascade
    .fromTo([line1Ref.current, line2Ref.current, line3Ref.current],
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 1, ease: 'power3.out' },
      '-=1.2'
    )
    .fromTo(subRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo(ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo(scrollIndicatorRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      '-=0.3'
    );

    // Parallax on scroll
    gsap.to(imgRef.current, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    gsap.to(overlayRef.current, {
      opacity: 0.7,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Scroll indicator loop
    gsap.to(scrollIndicatorRef.current, {
      y: 8,
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: 'power1.inOut',
      delay: 3,
    });

  }, []);

  return (
    <section ref={heroRef} style={{
      position: 'relative',
      height: '100vh',
      minHeight: 700,
      display: 'flex',
      alignItems: 'flex-end',
      overflow: 'hidden',
    }}>
      {/* Background image */}
      <img
        ref={imgRef}
        src="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=1600&q=85"
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 20%',
          willChange: 'transform',
        }}
      />

      {/* Gradient overlay */}
      <div ref={overlayRef} style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.5) 40%, rgba(8,8,8,0.2) 100%)',
      }} />

      {/* Coral accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 48,
        width: 1, height: '100%',
        background: 'linear-gradient(to bottom, transparent, var(--coral) 50%, transparent)',
        opacity: 0.3,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '0 48px 80px',
        maxWidth: 1000,
      }}>
        {/* Eyebrow */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 24,
        }}>
          <div style={{ width: 32, height: 1, background: 'var(--coral)' }} />
          <span style={{
            fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--coral)', fontWeight: 500,
          }}>Nuova Collezione 2025</span>
        </div>

        {/* Giant headline */}
        <div style={{ overflow: 'hidden', marginBottom: 8 }}>
          <h1 ref={line1Ref} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(72px, 13vw, 180px)',
            lineHeight: 0.88, letterSpacing: '-0.01em',
            color: 'var(--white)',
          }}>MOVE</h1>
        </div>
        <div style={{ overflow: 'hidden', marginBottom: 8 }}>
          <h1 ref={line2Ref} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(72px, 13vw, 180px)',
            lineHeight: 0.88, letterSpacing: '-0.01em',
            color: 'transparent',
            WebkitTextStroke: '1px var(--white)',
            display: 'inline-block',
          }}>LIKE A</h1>
        </div>
        <div style={{ overflow: 'hidden', marginBottom: 32 }}>
          <h1 ref={line3Ref} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(72px, 13vw, 180px)',
            lineHeight: 0.88, letterSpacing: '-0.01em',
            color: 'var(--coral)',
          }}>QUEEN</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          <p ref={subRef} style={{
            fontSize: 16, lineHeight: 1.6,
            color: 'var(--white-dim)',
            maxWidth: 340, fontWeight: 300,
          }}>
            Abbigliamento sportivo premium che ti fa sentire invincibile.<br />
            <em style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}>Fatta per muoverti. Progettata per stupire.</em>
          </p>

          <div ref={ctaRef} style={{ display: 'flex', gap: 16 }}>
            <Link to="/shop" style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              padding: '16px 32px',
              background: 'var(--coral)',
              color: 'var(--white)',
              fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
              fontWeight: 600,
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.outline = '1px solid var(--coral)'; e.currentTarget.style.color = 'var(--coral)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--coral)'; e.currentTarget.style.outline = 'none'; e.currentTarget.style.color = 'var(--white)'; }}
            >
              Scopri la Collezione
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollIndicatorRef} style={{
        position: 'absolute', bottom: 32, right: 48,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 8,
        color: 'var(--white-dim)',
      }}>
        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Scroll</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>

      {/* Bottom stats bar */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        padding: '20px 48px',
        display: 'flex', gap: 48,
        background: 'rgba(8,8,8,0.6)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--border)',
        borderLeft: '1px solid var(--border)',
      }}>
        {[
          { num: '10K+', label: 'Clienti Felici' },
          { num: '4.9★', label: 'Valutazione Media' },
          { num: '48h', label: 'Spedizione Express' },
        ].map(({ num, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--coral)', letterSpacing: '0.05em' }}>{num}</div>
            <div style={{ fontSize: 11, color: 'var(--white-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div:last-child { display: none !important; }
          section > div:nth-child(5) { padding: 0 20px 120px !important; }
        }
      `}</style>
    </section>
  );
}
