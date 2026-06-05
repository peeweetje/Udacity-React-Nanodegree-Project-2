import gsap from 'gsap';

/**
 * Animates the category name text element with a fade-in and slide-up effect.
 * Does NOT modify innerHTML — works directly on the existing text element.
 *
 * @param container - The container element holding the category name
 * @param textSelector - CSS selector for the category name element
 * @param animationsEnabled - Whether animations are enabled
 * @param delay - Delay before the animation starts
 */
export function animateCategoryText(
  container: HTMLElement,
  textSelector: string,
  animationsEnabled: boolean,
  delay: number = 0.5
) {
  const textEl = container.querySelector(textSelector) as HTMLElement | null;
  if (!textEl) return;

  if (!animationsEnabled) {
    gsap.set(textEl, { y: 0, opacity: 1 });
    return;
  }

  gsap.set(textEl, { y: 12, opacity: 0 });
  gsap.to(textEl, {
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out',
    delay,
  });
}