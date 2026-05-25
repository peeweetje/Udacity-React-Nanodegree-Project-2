import gsap from 'gsap';

/**
 * Animates the notification cards on mount inside a GSAP context.
 * Each card slides in from the left with a fade, staggered for a cascading effect.,
 * matching the profile-info animation pattern.
 */
export function animateNotificationCards(animationsEnabled: boolean) {
  if (!animationsEnabled) {
    gsap.set('.notification-card', { x: 0, opacity: 1 });
    return;
  }
  // Set initial hidden state first so cards aren't visible before animation
  gsap.set('.notification-card', { x: -40, opacity: 0 });
  gsap.to(
    '.notification-card',
    {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.20,
      delay: 0.2,
    }
  );
}

/**
 * Animates the empty state when there are no notifications.
 * The bell icon fades in smoothly.
 */
export function animateEmptyState(animationsEnabled: boolean) {
  if (!animationsEnabled) {
    gsap.set('.notification-empty-state', { opacity: 1 });
    return;
  }
  // Set initial hidden state first so empty state isn't visible before animation
  gsap.set('.notification-empty-state', { opacity: 0 });
  gsap.to(
    '.notification-empty-state',
    { opacity: 1, duration: 0.7, ease: 'power3.out' }
  );
}
