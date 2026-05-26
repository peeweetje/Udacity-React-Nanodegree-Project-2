import gsap from 'gsap';

/**
 * Animates cards on mount inside a GSAP context.
 * Cards slide up from below, fade in, and rotate slightly in 3D,
 * matching the home-page card animation pattern.
 */
export function animateCards(
  selector: string,
  animationsEnabled: boolean,
  stagger: number = 0.15,
  delay: number = 0.2
) {
  if (!animationsEnabled) {
    gsap.set(selector, { y: 0, opacity: 1, rotateX: 0 });
    return;
  }
  // Set initial hidden state so cards aren't visible before animation
  gsap.set(selector, { y: 60, opacity: 0, rotateX: 15, transformPerspective: 600 });
  gsap.to(selector, {
    y: 0,
    opacity: 1,
    rotateX: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
    stagger,
    delay,
  });
}

/**
 * Adds hover animation to a card element – lifts it up, scales slightly,
 * and adds a subtle shadow.
 * Returns a cleanup function to remove the event listeners.
 */
export function animateCardHover(card: Element) {
  const handleMouseEnter = () => {
    gsap.to(card, {
      y: -8,
      scale: 1.03,
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(card, {
      y: 0,
      scale: 1,
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