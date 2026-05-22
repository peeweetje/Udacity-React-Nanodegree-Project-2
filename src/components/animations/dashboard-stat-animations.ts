import gsap from 'gsap';

/**
 * Animates the dashboard stat cards on mount.
 * Each card staggers in from the bottom with a fade.
 */
export function animateDashboardStats(container: HTMLElement) {
  const cards = container.querySelectorAll('[data-dashboard-stat-card]');
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (cards.length > 0) {
    tl.fromTo(
      cards,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 }
    );
  }

  return tl;
}