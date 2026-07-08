import gsap from 'gsap';

export interface CardMountOptions {
  /** Whether animations are enabled */
  animationsEnabled: boolean;
  /** Stagger delay between cards (seconds) */
  stagger?: number;
  /** Initial delay before animation starts (seconds) */
  delay?: number;
}

/**
 * Animates a single card element on mount — slides up from below, fades in,
 * and rotates slightly in 3D.
 */
export function animateCardMount(card: Element, delay: number = 0.2) {
  gsap.fromTo(
    card,
    { y: 60, opacity: 0, rotateX: 15, transformPerspective: 600 },
    { y: 0, opacity: 1, rotateX: 0, duration: 0.8, ease: 'back.out(1.7)', delay }
  );
}

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
  // Guard: skip if no elements match the selector to avoid GSAP "target not found" warnings
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return;

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
 * Options for hover animations on card elements.
 */
export interface CardHoverOptions {
  /** Vertical lift on hover (negative = up). Default: -8 */
  y?: number;
  /** Scale on hover. Default: 1.03. Set to 1 to disable scaling (avoids text blur). */
  scale?: number;
  /** Box shadow on hover. Default: '0 20px 40px rgba(0,0,0,0.15)' */
  boxShadow?: string;
}

/**
 * Adds a hover animation to a card element — lifts it up, optionally scales,
 * and adds a subtle shadow. Returns a cleanup function to remove event listeners.
 *
 * @example
 * ```ts
 * // Default card hover (lift + scale + shadow)
 * animateCardHover(card);
 *
 * // Form card hover (lighter lift, no scale, softer shadow)
 * animateCardHover(card, { y: -4, scale: 1, boxShadow: '0 12px 28px rgba(0,0,0,0.12)' });
 * ```
 */
export function animateCardHover(card: Element, options: CardHoverOptions = {}) {
  const {
    y = -8,
    scale = 1.03,
    boxShadow = '0 20px 40px rgba(0,0,0,0.15)',
  } = options;

  const handleMouseEnter = () => {
    gsap.to(card, {
      y,
      scale,
      boxShadow,
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
