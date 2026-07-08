import React from 'react';
import { gsap } from 'gsap';
import { animateCardMount, animateCardHover } from './card-animations';

export function animateArrow(arrowRef: React.RefObject<SVGSVGElement | null>) {
  if (!arrowRef.current) return;
  gsap.to(arrowRef.current, {
    x: 6,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
  });
}

export function animateTitle(titleRef: React.RefObject<HTMLHeadingElement | null>) {
  if (!titleRef.current) return;
  gsap.fromTo(
    titleRef.current,
    { y: -30, opacity: 0, scale: 0.8 },
    { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' }
  );
}

export function animatePlusIcon(plusIconRef: React.RefObject<SVGSVGElement | null>) {
  const plusIcon = plusIconRef.current;
  if (!plusIcon) return;

  const button = plusIcon.closest('a');
  if (!button) return;

  button.addEventListener('mouseenter', () => {
    gsap.to(plusIcon, {
      rotation: 180,
      scale: 1.2,
      duration: 0.4,
      ease: 'back.out(1.7)',
    });
  });
  button.addEventListener('mouseleave', () => {
    gsap.to(plusIcon, {
      rotation: 0,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.7)',
    });
  });
}

export function animateOrbs(bgRef: React.RefObject<HTMLDivElement | null>) {
  if (!bgRef.current) return;

  const orbs = Array.from(bgRef.current.children) as HTMLDivElement[];
  const configs = [
    { x: 120, y: 100, dur: 5 },
    { x: -80, y: -80, dur: 6, delay: 1 },
    { x: 60, y: -80, dur: 5.5, delay: 0.5 },
  ];

  orbs.forEach((orb, i) => {
    const cfg = configs[i];
    if (!cfg) return;

    gsap.fromTo(
      orb,
      { x: 0, y: 0 },
      {
        x: cfg.x,
        y: cfg.y,
        duration: cfg.dur / 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: cfg.delay || 0,
      }
    );
  });
}

/**
 * Animates home page cards on mount with mount animation + hover effects.
 * Delegates to the shared functions from card-animations.ts to avoid duplication.
 */
export function animateCards(cardsRef: React.MutableRefObject<HTMLDivElement[]>) {
  const cards = cardsRef.current.filter(Boolean);
  if (!cards.length) return;

  cards.forEach((card, i) => {
    animateCardMount(card, 0.8 + i * 0.2);
    animateCardHover(card);
  });
}
