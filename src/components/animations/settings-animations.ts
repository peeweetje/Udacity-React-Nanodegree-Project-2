import { animateCards, animateCardHover } from './card-animations';

/**
 * Animates the settings section cards on mount inside a GSAP context.
 * Cards slide up from below, fade in, and rotate slightly in 3D,
 * matching the home-page card animation pattern.
 */
export function animateSettingsCards(animationsEnabled: boolean) {
  animateCards('.settings-card', animationsEnabled, 0.2, 0.3);
}

/**
 * Animates a single settings card on hover – lifts it up, scales slightly,
 * and adds a subtle shadow, matching the home-page card hover animation.
 * Returns a cleanup function to remove the event listeners.
 */
export function animateSettingsCardHover(card: Element) {
  return animateCardHover(card);
}
