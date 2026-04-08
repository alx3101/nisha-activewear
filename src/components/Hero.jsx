import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function splitToChars(el) {
  if (el.dataset.split === 'true') return Array.from(el.children); // guard: already split
  const text = el.textContent;
  el.textContent = '';
  el.dataset.split = 'true';
  return text.split('').map(char => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    el.appendChild(span);
    return span;
  });
}

export default function Hero() {
  const heroRef      = useRef(null);
  const imgBgRef     = useRef(null);
  const overlayRef   = useRef(null);
  const line1Ref     = useRef(null);
  const line1WrapRef = useRef(null);
  const line2Ref     = useRef(null);
  const line2WrapRef = useRef(null);
  const line3Ref     = useRef(null);
  const line3WrapRef = useRef(null);
  const subRef       = useRef(null);
  const ctaRef       = useRef(null);
  const badgeRef     = useRef(null);
  const statsRef     = useRef(null);
  const eyebrowRef   = useRef(null);
  const initialized  = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Measure natural heights BEFORE collapsing
    const h1 = line1WrapRef.current.scrollHeight;
    const h2 = line2WrapRef.current.scrollHeight;
    const h3 = line3WrapRef.current.scrollHeight;

    // Collapse all three wrappers → completely invisible on load
    gsap.set([line1WrapRef.current, line2WrapRef.current, line3WrapRef.current],
      { height: 0, overflow: 'hidden' }
    );
    gsap.set(line2Ref.current, { opacity: 0, x: -40 });

    const tl = gsap.timeline({ delay: 0.2 });

    tl
      // Image reveal
      .fromTo(imgBgRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }
      )
      .fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.5'
      )
      // Eyebrow line
      .fromTo(eyebrowRef.current.children,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power3.out', transformOrigin: 'left' },
        '-=0.3'
      )
      // MOVE — expand wrapper, then cascade letters
      .to(line1WrapRef.current, { height: h1, duration: 0.5, ease: 'power3.out' }, '-=0.1')
      .add(() => {
        gsap.fromTo(
          splitToChars(line1Ref.current),
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, stagger: 0.04, duration: 0.6, ease: 'power3.out' }
        );
      }, '<')
      // QUEEN — same, offset
      .to(line3WrapRef.current, { height: h3, duration: 0.5, ease: 'power3.out' }, '+=0.1')
      .add(() => {
        gsap.fromTo(
          splitToChars(line3Ref.current),
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, stagger: 0.04, duration: 0.6, ease: 'power3.out' }
        );
      }, '<')
      // LIKE A — expand into gap between MOVE and QUEEN, slide text in
      .to(line2WrapRef.current, { height: h2, duration: 0.6, ease: 'power3.inOut' }, '+=0.25')
      .to(line2Ref.current,     { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, '<+=0.06')
      // Shimmer on MOVE + QUEEN
      .add(() => {
        gsap.to(line1Ref.current, { textShadow: '0 0 60px rgba(255,255,255,0.6)', duration: 0.28, yoyo: true, repeat: 1 });
        gsap.to(line3Ref.current, { textShadow: '0 0 80px rgba(255,58,94,0.8)',   duration: 0.28, yoyo: true, repeat: 1 });
      }, '-=0.15')
      // Sub + CTA (start invisible, no layout shift since absolutely positioned)
      .fromTo([subRef.current, ctaRef.current],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.65, ease: 'power2.out' },
        '+=0'
      )
      .fromTo(statsRef.current.children,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.45 },
        '-=0.45'
      );

    // Rotating badge
    gsap.to(badgeRef.current, {
      rotation: 360, duration: 18, ease: 'none', repeat: -1,
    });

    // Parallax on background image
    gsap.to(imgBgRef.current, {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Overlay darkens on scroll
    gsap.to(overlayRef.current, {
      opacity: 0.9,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'center top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section ref={heroRef} style={{
      position: 'relative',
      height: '100vh',
      minHeight: 680,
      overflow: 'hidden',
    }}>

      {/* Background — fills full 100vh including under transparent nav */}
      <img
        ref={imgBgRef}
        src="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=1800&q=90"
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '115%',
          objectFit: 'cover', objectPosition: 'center 10%',
          willChange: 'transform',
        }}
      />

      {/* Gradient — heavy at bottom so text is readable */}
      <div ref={overlayRef} style={{
        position: 'absolute', inset: 0,
        background: `
          linear-gradient(to top, rgba(26,20,16,0.92) 0%, rgba(26,20,16,0.5) 30%, rgba(26,20,16,0.1) 60%, transparent 100%),
          linear-gradient(to right, rgba(26,20,16,0.25) 0%, transparent 55%)
        `,
      }} />

      {/* Rotating badge — top right */}
      <div className="hero-badge-wrap" style={{ position: 'absolute', top: '14%', right: '5%', width: 120, height: 120 }}>
        <svg ref={badgeRef} viewBox="0 0 120 120" width="120" height="120">
          <defs>
            <path id="ct" d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"/>
          </defs>
          <text style={{ fontSize: 11, fill: 'rgba(255,255,255,0.7)', letterSpacing: '0.18em', fontFamily: 'var(--font-body)' }}>
            <textPath href="#ct">NUOVA COLLECTION 2025 ✦ NISHA ✦ </textPath>
          </text>
        </svg>
        <div style={{
          position: 'absolute', inset: '30%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--coral)', borderRadius: '50%',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" strokeWidth="0">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
      </div>

      {/* Content — absolutely at bottom so image breathes above */}
      <div className="hero-content" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        zIndex: 2,
        padding: '0 56px 80px',
        maxWidth: 1200,
      }}>
        {/* Eyebrow */}
        <div ref={eyebrowRef} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 32, height: 1.5, background: 'var(--coral)', transformOrigin: 'left' }} />
          <span style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--coral)', fontWeight: 600 }}>
            Collezione Primavera 2025
          </span>
        </div>

        {/* Headline block — all three wrappers start at height:0 */}
        <div className="hero-headline" style={{ marginBottom: 36 }}>
          {/* MOVE */}
          <div ref={line1WrapRef} style={{ lineHeight: 0.88 }}>
            <h1 ref={line1Ref} style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(60px, 9vw, 140px)',
              letterSpacing: '-0.01em',
              color: '#fff',
            }}>MOVE</h1>
          </div>

          {/* LIKE A — expands last, slides in from left */}
          <div ref={line2WrapRef} style={{ lineHeight: 0.88 }}>
            <h1 ref={line2Ref} style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(60px, 9vw, 140px)',
              letterSpacing: '-0.01em',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.55)',
            }}>LIKE A</h1>
          </div>

          {/* QUEEN */}
          <div ref={line3WrapRef} style={{ lineHeight: 0.88 }}>
            <h1 ref={line3Ref} style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(60px, 9vw, 140px)',
              letterSpacing: '-0.01em',
              color: 'var(--coral)',
              textShadow: '0 0 40px rgba(255,58,94,0.25)',
            }}>QUEEN</h1>
          </div>
        </div>

        {/* Sub + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          <p ref={subRef} style={{
            fontSize: 14, lineHeight: 1.75,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 300, fontWeight: 300,
          }}>
            Abbigliamento sportivo premium che ti fa sentire invincibile.{' '}
            <em style={{ fontFamily: 'var(--font-italic)', color: '#fff' }}>Fatta per muoverti.</em>
          </p>
          <div ref={ctaRef}>
            <MagneticLink to="/shop" />
          </div>
        </div>
      </div>

      {/* Stats bar — bottom right */}
      <div ref={statsRef} className="hero-stats" style={{
        position: 'absolute', bottom: 0, right: 0,
        display: 'flex',
        background: 'rgba(247,244,240,0.9)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        borderLeft: '1px solid var(--border)',
        zIndex: 3,
      }}>
        {[
          { num: '10K+', label: 'Queens' },
          { num: '4.9★', label: 'Rating' },
          { num: '48h',  label: 'Delivery' },
        ].map(({ num, label }, i) => (
          <div key={label} style={{
            padding: '18px 30px', textAlign: 'center',
            borderRight: i < 2 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--coral)', letterSpacing: '0.04em' }}>{num}</div>
            <div style={{ fontSize: 9, color: 'var(--white-dim)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-stats   { display: none !important; }
          .hero-content { padding: 0 20px 60px !important; }
          .hero-badge-wrap { display: none !important; }
        }
        @media (max-width: 480px) {
          .hero-headline h1 { font-size: clamp(80px, 22vw, 120px) !important; }
        }
      `}</style>
    </section>
  );
}

function MagneticLink({ to }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - rect.left - rect.width / 2) * 0.28,
      y: (e.clientY - rect.top - rect.height / 2) * 0.28,
      duration: 0.35, ease: 'power2.out',
    });
  };
  const onLeave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,0.5)' });

  return (
    <Link
      to={to}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 14,
        padding: '16px 32px',
        background: '#fff',
        color: '#1A1410',
        fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        fontWeight: 600,
        transition: 'background 0.25s, color 0.25s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--coral)'; e.currentTarget.style.color = '#fff'; }}
    >
      Scopri la Collezione
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </Link>
  );
}
