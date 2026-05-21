import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';

const ORBS = [
  { size: 320, color: 'rgba(20, 184, 166, 0.6)', startX: 0.15, startY: 0.2 },
  { size: 260, color: 'rgba(59, 130, 246, 0.5)', startX: 0.85, startY: 0.25 },
  { size: 380, color: 'rgba(168, 85, 247, 0.45)', startX: 0.5, startY: 0.75 },
  { size: 220, color: 'rgba(242, 159, 200, 0.711)', startX: 0.25, startY: 0.85 },
  { size: 300, color: 'rgba(202, 192, 88, 0.732)', startX: 0.75, startY: 0.65 },
];

const AnimatedOrbs = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement[]>([]);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);

  useEffect(() => {
    // Kill all GSAP animations on orbs when animations are toggled
    const allOrbs = orbsRef.current.filter(Boolean);

    if (!animationsEnabled) {
      allOrbs.forEach((orb) => {
        gsap.killTweensOf(orb);
        orb.style.opacity = '1';
        orb.style.transform = 'translate(-50%, -50%) scale(1)';
      });
      return;
    }

    const timer = setTimeout(() => {
      allOrbs.forEach((orb, i) => {
        if (!orb) return;

        gsap.fromTo(
          orb,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            delay: i * 0.2,
            onComplete: () => {
              gsap.to(orb, {
                opacity: 0.2 + i * 0.05,
                duration: 2 + i * 0.4,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
              });
            },
          }
        );
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      allOrbs.forEach((orb) => gsap.killTweensOf(orb));
    };
  }, [animationsEnabled]);

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 overflow-hidden pointer-events-none z-0'
      aria-hidden='true'
    >
      {ORBS.map((orb, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) orbsRef.current[i] = el;
          }}
          className='absolute rounded-full opacity-0'
          style={{
            width: orb.size,
            height: orb.size,
            top: `${orb.startY * 100}%`,
            left: `${orb.startX * 100}%`,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
            transform: 'translate(-50%, -50%)',
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedOrbs;