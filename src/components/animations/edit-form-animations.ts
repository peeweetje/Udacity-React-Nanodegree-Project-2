import gsap from 'gsap';
import { animateCards } from './card-animations';

/**
 * Animates the edit post form card on mount inside a GSAP context.
 * The card slides up from below, fades in, and rotates slightly in 3D,
 * matching the home-page card animation pattern.
 */
export function animateEditPostCard(animationsEnabled: boolean) {
  animateCards('.edit-post-card', animationsEnabled, 0.2, 0.3);
}

/**
 * Animates the edit comment form card on mount inside a GSAP context.
 * The card slides up from below, fades in, and rotates slightly in 3D,
 * matching the home-page card animation pattern.
 */
export function animateEditCommentCard(animationsEnabled: boolean) {
  animateCards('.edit-comment-card', animationsEnabled, 0.2, 0.3);
}

/**
 * Animates a single edit form card on hover – lifts it up and adds a shadow,
 * without scaling to avoid text blurriness.
 * Returns a cleanup function to remove the event listeners.
 */
export function animateEditFormCardHover(card: Element) {
  const handleMouseEnter = () => {
    gsap.to(card, {
      y: -4,
      boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(card, {
      y: 0,
      boxShadow: 'none',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  card.addEventListener('mouseenter', handleMouseEnter);
  card.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    card.removeEventListener('mouseenter', handleMouseEnter);
    card.removeEventListener('mouseleave', handleMouseLeave);
  };
}
