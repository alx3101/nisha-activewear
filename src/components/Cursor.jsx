import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(dot, { x: mx, y: my, duration: 0.08, ease: 'none' });
    };

    let raf;
    const loop = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      gsap.set(ring, { x: rx, y: ry });
      raf = requestAnimationFrame(loop);
    };
    loop();

    // Hover states
    const addHover = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    const onEnter = (e) => {
      const text = e.currentTarget.dataset.cursor;
      gsap.to(ring, { scale: 2.2, opacity: 0.5, duration: 0.4, ease: 'power2.out' });
      gsap.to(dot, { scale: 0.4, duration: 0.3 });
      if (text) {
        label.textContent = text;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3 });
      }
    };

    const onLeave = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.to(dot, { scale: 1, duration: 0.3 });
      gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 });
    };

    // Click effect
    const onClick = () => {
      gsap.to(ring, {
        scale: 2.8, opacity: 0,
        duration: 0.5, ease: 'power2.out',
        onComplete: () => gsap.set(ring, { scale: 1, opacity: 1 }),
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick);
    addHover();

    // Re-add hover listeners on DOM changes (for dynamically added elements)
    const observer = new MutationObserver(addHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div ref={dotRef} style={{
        position: 'fixed', width: 8, height: 8,
        background: 'var(--coral)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'multiply',
      }} />
      {/* Ring */}
      <div ref={ringRef} style={{
        position: 'fixed', width: 40, height: 40,
        border: '1.5px solid var(--coral)',
        borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%, -50%)',
        opacity: 0.8,
      }}>
        {/* Label inside ring */}
        <div ref={labelRef} style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--coral)', fontWeight: 600,
          opacity: 0, transform: 'scale(0.8)',
          whiteSpace: 'nowrap',
        }} />
      </div>
    </>
  );
}
