import gsap from 'gsap';

/**
 * Animates the message cards on mount inside a GSAP context.
 * Each card slides in from the left with a fade, one by one,
 * creating a smooth cascading entrance effect.
 */
export function animateMessageCards(animationsEnabled: boolean) {
  if (!animationsEnabled) {
    gsap.set('.message-card', { x: 0, opacity: 1 });
    return;
  }
  // Set initial hidden state first so cards aren't visible before animation
  gsap.set('.message-card', { x: -40, opacity: 0 });
  gsap.to(
    '.message-card',
    {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.15,
      delay: 0.2,
    }
  );
}

/**
 * Animates the empty state when there are no messages.
 * The icon fades in smoothly.
 */
export function animateMessagesEmptyState(animationsEnabled: boolean) {
  if (!animationsEnabled) {
    gsap.set('.messages-empty-state', { opacity: 1 });
    return;
  }
  gsap.set('.messages-empty-state', { opacity: 0 });
  gsap.to(
    '.messages-empty-state',
    { opacity: 1, duration: 0.7, ease: 'power3.out' }
  );
}