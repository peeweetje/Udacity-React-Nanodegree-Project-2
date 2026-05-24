import gsap from 'gsap';

/**
 * Plays a bounce/pulse animation on the button that was clicked
 * to give visual feedback for thumbs up/down votes.
 * @param buttonElement - the button element that was clicked
 * @param direction - 'up' for thumbs up (green pulse) or 'down' for thumbs down (red pulse)
 * @param enabled - whether animations are enabled (skips animation if false)
 */
export function animateVoteButton(buttonElement: HTMLElement, direction: 'up' | 'down', enabled: boolean = true) {
  if (!enabled) return;

  // Kill any existing tweens on this element to avoid conflicts
  gsap.killTweensOf(buttonElement);

  const color = direction === 'up' ? '#10b981' : '#ef4444'; // green / red

  gsap.to(buttonElement, {
    scale: 1.25,
    duration: 0.15,
    ease: 'power2.out',
    onComplete: () => {
      gsap.to(buttonElement, {
        scale: 1,
        duration: 0.3,
        ease: 'back.out(2)',
      });
    },
  });

  // Brief colored glow effect
  gsap.to(buttonElement, {
    boxShadow: `0 0 12px ${color}`,
    duration: 0.2,
    ease: 'power2.out',
    onComplete: () => {
      gsap.to(buttonElement, {
        boxShadow: '0 0 0px rgba(0,0,0,0)',
        duration: 0.4,
        ease: 'power2.in',
      });
    },
  });
}