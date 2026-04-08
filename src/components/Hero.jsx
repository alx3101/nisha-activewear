import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Split text into individual letter spans
function splitToChars(el) {
  const text = el.textContent;
  el.textContent = '';
  return text.split('').map(char => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.overflow = 'hidden';
    el.appendChild(span);
    return span;
  });
}

export default function Hero() {
  const heroRef = useRef(null);
  const imgBgRef = useRef(null);
  const imgFgRef = useRef(null);
  const overlayRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);
  const statsRef = useRef(null);
  const eyebrowRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    // Image reveal — opacity only (no clipPath flash on mount)
    tl.fromTo(imgBgRef.current,
      { opacity: 0, scale: 1.08 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
    )
    // Overlay
    .fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '-=0.6'
    )

    // Eyebrow line
    .fromTo(eyebrowRef.current.children,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out', transformOrigin: 'left' },
      '-=0.3'
    )

    // MOVE — letters cascade in from bottom
    .add(() => {
      const chars = splitToChars(line1Ref.current);
      gsap.fromTo(chars,
        { y: '120%', opacity: 0 },
        { y: '0%', opacity: 1, stagger: 0.04, duration: 0.7, ease: 'power3.out' }
      );
    }, '-=0.2')

    // LIKE A — slide from right
    .fromTo(line2Ref.current,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    )

    // QUEEN — letters cascade
    .add(() => {
      const chars = splitToChars(line3Ref.current);
      gsap.fromTo(chars,
        { y: '-120%', opacity: 0 },
        { y: '0%', opacity: 1, stagger: 0.05, duration: 0.7, ease: 'power3.out' }
      );
    }, '-=0.5')

    // Sub + CTA + stats
    .fromTo([subRef.current, ctaRef.current],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(statsRef.current.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 },
      '-=0.5'
    );

    // Rotating badge
    gsap.to(badgeRef.current, {
      rotation: 360, duration: 18, ease: 'none', repeat: -1,
    });

    // Parallax scroll on background image
    gsap.to(imgBgRef.current, {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });

    // Parallax overlay
    gsap.to(overlayRef.current, {
      opacity: 0.85,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'center top',
        end: 'bottom top',
        scrub: 1,
      }
    });

    // Text slides up on scroll
    gsap.to([line1Ref.current, line2Ref.current, line3Ref.current],
      {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
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
        ref={imgBgRef}
        src="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=1800&q=90"
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '110%',
          objectFit: 'cover', objectPosition: 'center 15%',
          willChange: 'transform',
        }}
      />

      {/* Multi-layer gradient overlay */}
      <div ref={overlayRef} style={{
        position: 'absolute', inset: 0,
        background: `
          linear-gradient(to top, rgba(247,244,240,1) 0%, rgba(247,244,240,0.15) 35%, transparent 60%),
          linear-gradient(to right, rgba(247,244,240,0.3) 0%, transparent 50%)
        `,
      }} />

      {/* Floating rotating badge */}
      <div style={{
        position: 'absolute', top: '12%', right: '6%',
        width: 120, height: 120,
      }}>
        <svg ref={badgeRef} viewBox="0 0 120 120" width="120" height="120">
          <defs>
            <path id="circle-text" d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"/>
          </defs>
          <text style={{ fontSize: 11, fill: '#1A1410', letterSpacing: '0.18em', fontFamily: 'var(--font-body)', textTransform: 'uppercase' }}>
            <textPath href="#circle-text">NUOVA COLLECTION 2025 ✦ NISHA ✦ </textPath>
          </text>
        </svg>
        <div style={{
          position: 'absolute', inset: '30%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--coral)', borderRadius: '50%',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
      </div>

      {/* Vertical accent line */}
      <div style={{
        position: 'absolute', top: 100, left: 52,
        width: 1, height: '55%',
        background: 'linear-gradient(to bottom, transparent, rgba(255,58,94,0.5), transparent)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '0 56px 90px',
        maxWidth: 1100,
      }}>
        {/* Eyebrow */}
        <div ref={eyebrowRef} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 20,
        }}>
          <div style={{ width: 36, height: 1.5, background: 'var(--coral)', transformOrigin: 'left' }} />
          <span style={{
            fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--coral)', fontWeight: 600,
          }}>Collezione Primavera 2025</span>
        </div>

        {/* MOVE */}
        <div style={{ overflow: 'hidden', lineHeight: 0.85, marginBottom: 4 }}>
          <h1 ref={line1Ref} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(80px, 14vw, 200px)',
            letterSpacing: '-0.02em',
            color: '#fff',
            textShadow: '0 2px 40px rgba(0,0,0,0.15)',
          }}>MOVE</h1>
        </div>

        {/* LIKE A */}
        <div style={{ overflow: 'hidden', lineHeight: 0.85, marginBottom: 4 }}>
          <h1 ref={line2Ref} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(80px, 14vw, 200px)',
            letterSpacing: '-0.02em',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.65)',
            textShadow: 'none',
          }}>LIKE A</h1>
        </div>

        {/* QUEEN */}
        <div style={{ overflow: 'hidden', lineHeight: 0.85, marginBottom: 40 }}>
          <h1 ref={line3Ref} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(80px, 14vw, 200px)',
            letterSpacing: '-0.02em',
            color: 'var(--coral)',
            textShadow: '0 0 60px rgba(255,58,94,0.3)',
          }}>QUEEN</h1>
        </div>

        {/* Sub + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
          <p ref={subRef} style={{
            fontSize: 15, lineHeight: 1.75,
            color: 'rgba(26,20,16,0.7)',
            maxWidth: 320, fontWeight: 300,
          }}>
            Abbigliamento sportivo premium che ti fa sentire invincibile.{' '}
            <em style={{ fontFamily: 'var(--font-italic)', color: 'var(--white)' }}>
              Fatta per muoverti.
            </em>
          </p>

          <div ref={ctaRef}>
            <MagneticLink to="/shop">
              <span>Scopri la Collezione</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </MagneticLink>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div ref={statsRef} style={{
        position: 'absolute', bottom: 0, right: 0,
        display: 'flex',
        background: 'rgba(247,244,240,0.85)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        borderLeft: '1px solid var(--border)',
      }}>
        {[
          { num: '10K+', label: 'Queens' },
          { num: '4.9★', label: 'Rating' },
          { num: '48h', label: 'Delivery' },
        ].map(({ num, label }, i) => (
          <div key={label} style={{
            padding: '20px 36px',
            textAlign: 'center',
            borderRight: i < 2 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--coral)', letterSpacing: '0.05em' }}>{num}</div>
            <div style={{ fontSize: 10, color: 'var(--white-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
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

// Magnetic CTA button
function MagneticLink({ to, children }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
  };

  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  };

  return (
    <Link
      to={to}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 14,
        padding: '18px 36px',
        background: 'var(--white)',
        color: 'var(--black)',
        fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        fontWeight: 600,
        border: '1px solid var(--border)',
        transition: 'background 0.3s, color 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--coral)';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.borderColor = 'var(--coral)';
      }}
      onMouseLeave2={e => {
        e.currentTarget.style.background = 'var(--white)';
        e.currentTarget.style.color = 'var(--black)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {children}
    </Link>
  );
}
