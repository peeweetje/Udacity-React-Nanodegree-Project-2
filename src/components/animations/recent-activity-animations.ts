import gsap from 'gsap';

/**
 * Animates the recent activity table rows on mount.
 * Each row fades in and scales up slightly with a stagger,
 * giving a distinctive "pop-in" effect different from the
 * stat card slide-up animation.
 * Overflow is hidden on the container during animation to prevent scrollbars.
 */
export function animateRecentActivityRows(container: HTMLElement) {
  const card = container.querySelector('[data-recent-activity-card]') as HTMLElement | null;
  const tableWrapper = container.querySelector('[data-recent-activity-table-wrapper]') as HTMLElement | null;
  const rows = container.querySelectorAll('[data-recent-activity-row]');

  const tl = gsap.timeline({
    defaults: { ease: 'back.out(1.2)' },
    onStart: () => {
      if (tableWrapper) tableWrapper.style.overflow = 'hidden';
    },
    onComplete: () => {
      if (tableWrapper) tableWrapper.style.overflow = '';
    },
  });

  // Card container: subtle fade in
  if (card) {
    tl.fromTo(
      card,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );
  }

  // Table rows: pop-in with scale + fade
  if (rows.length > 0) {
    tl.fromTo(
      rows,
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06 },
      '-=0.2'
    );
  }

  return tl;
}