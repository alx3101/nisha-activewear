import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' });
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
      requestAnimationFrame(animate);
    };

    const onEnter = () => {
      gsap.to(dot, { scale: 2.5, duration: 0.3 });
      gsap.to(ring, { scale: 1.5, opacity: 0.6, duration: 0.3 });
    };
    const onLeave = () => {
      gsap.to(dot, { scale: 1, duration: 0.3 });
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });
    };

    window.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    animate();
    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', width: 10, height: 10,
        background: 'var(--coral)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'normal',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', width: 36, height: 36,
        border: '1px solid rgba(255,58,94,0.5)',
        borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%, -50%)',
      }} />
    </>
  );
}
