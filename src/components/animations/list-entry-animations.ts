import gsap from 'gsap';

interface ListEntryOptions {
  /** CSS selector for the list items to animate */
  itemSelector: string;
  /** Whether animations are enabled */
  enabled: boolean;
  /** Initial X offset for slide-in (negative = from left, positive = from right) */
  xOffset?: number;
  /** Duration of each item animation (seconds) */
  duration?: number;
  /** Stagger delay between items (seconds) */
  stagger?: number;
  /** Initial delay before animation starts (seconds) */
  delay?: number;
  /** Easing function */
  ease?: string;
}

/**
 * Animates list items sliding in from a direction with staggered fade-in.
 * Configurable for messages, notifications, or any list of cards/items.
 */
export function animateListItems(options: ListEntryOptions) {
  const {
    itemSelector,
    enabled,
    xOffset = -40,
    duration = 0.6,
    stagger = 0.15,
    delay = 0.2,
    ease = 'power3.out',
  } = options;

  if (!enabled) {
    gsap.set(itemSelector, { x: 0, opacity: 1 });
    return;
  }

  gsap.set(itemSelector, { x: xOffset, opacity: 0 });
  gsap.to(itemSelector, {
    x: 0,
    opacity: 1,
    duration,
    ease,
    stagger,
    delay,
  });
}

/**
 * Animates an empty state element with a smooth fade-in.
 * Works for messages, notifications, or any empty state.
 */
export function animateEmptyState(
  selector: string,
  enabled: boolean,
  duration: number = 0.7
) {
  if (!enabled) {
    gsap.set(selector, { opacity: 1 });
    return;
  }

  gsap.set(selector, { opacity: 0 });
  gsap.to(selector, { opacity: 1, duration, ease: 'power3.out' });
}