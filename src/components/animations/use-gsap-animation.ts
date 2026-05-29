import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { animateCardHover } from './card-animations';

/**
 * A reusable hook that runs GSAP animations inside a scoped GSAP context.
 *
 * Eliminates the repetitive `useEffect` + `gsap.context()` + `ctx.revert()` pattern
 * that is duplicated across many components.
 *
 * The `animator` callback captures `animationsEnabled` from the component's closure,
 * so there's no need to pass it explicitly as a parameter.
 *
 * @example
 * ```tsx
 * useGsapContext(containerRef, () => {
 *   animateCards('.post-card', animationsEnabled, 0.2, 0.4);
 * }, [animationsEnabled, posts.length]);
 * ```
 *
 * @example
 * ```tsx
 * useGsapContext(containerRef, () => {
 *   animateListItems({ itemSelector: '.card', enabled: animationsEnabled });
 * }, [animationsEnabled, items.length]);
 * ```
 *
 * @param ref - The container ref to scope the GSAP context to
 * @param animator - Callback that runs inside the GSAP context (captures deps via closure)
 * @param deps - Dependencies array passed to useEffect
 */
export function useGsapContext(
  ref: RefObject<HTMLElement | null>,
  animator: () => void,
  deps: React.DependencyList
) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      animator();
    }, ref);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * A reusable hook that attaches card hover effects (`animateCardHover`)
 * to all elements matching a selector within a container ref.
 *
 * Cleans up event listeners on unmount or dependency changes.
 *
 * @example
 * ```tsx
 * useGsapCardHover(containerRef, '.post-card', animationsEnabled);
 * ```
 *
 * @param containerRef - The container ref to query for hoverable elements
 * @param selector - CSS selector to find hoverable cards
 * @param animationsEnabled - Whether animations are enabled
 * @param deps - Additional dependencies (defaults to [animationsEnabled])
 */
export function useGsapCardHover(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  animationsEnabled: boolean,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    if (!animationsEnabled) return;

    const cards = containerRef.current?.querySelectorAll(selector);
    if (!cards || cards.length === 0) return;

    const cleanups = Array.from(cards).map((card) => animateCardHover(card));

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationsEnabled, ...deps]);
}

interface UseGsapTimelineOptions {
  /**
   * Callback that returns a GSAP timeline when animations are enabled.
   * This is called inside the effect when `enabled` is true.
   */
  animate: () => gsap.core.Timeline | void;
  /**
   * Callback that runs when animations are disabled, to set elements to their final visible state.
   * Receives the container ref's current element so you can query and gsap.set() elements.
   */
  onDisabled?: (container: HTMLElement | null) => void;
  /**
   * Optional callback triggered when the timeline completes (via `eventCallback('onComplete', ...)`).
   */
  onComplete?: () => void;
  /**
   * Whether animations are enabled.
   */
  enabled: boolean;
  /**
   * The container ref to scope any element queries.
   */
  containerRef: RefObject<HTMLElement | null>;
  /**
   * Additional dependencies (defaults to []).
   * `enabled` is always included automatically.
   */
  deps?: React.DependencyList;
}

/**
 * A reusable hook for timeline-based GSAP animations with `tl.kill()` cleanup.
 *
 * Handles the pattern used in `DashboardPage` (stat cards) and
 * `DashboardRecentActivity` (activity rows), where the animation function
 * returns a timeline that gets killed on cleanup.
 *
 * @example
 * ```tsx
 * useGsapTimeline({
 *   containerRef: statsGridRef,
 *   enabled: animationsEnabled,
 *   animate: () => animateDashboardStats(statsGridRef.current!),
 *   onComplete: () => setAnimationDone(true),
 *   onDisabled: (container) => {
 *     const cards = container?.querySelectorAll('[data-dashboard-stat-card]');
 *     gsap.set(cards, { y: 0, opacity: 1 });
 *   },
 * });
 * ```
 */
export function useGsapTimeline(options: UseGsapTimelineOptions) {
  const {
    animate,
    onDisabled,
    onComplete,
    enabled,
    containerRef,
    deps = [],
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!enabled) {
      // Set elements to final visible state immediately
      onDisabled?.(container);
      onComplete?.();
      return;
    }

    const tl = animate();
    if (tl && onComplete) {
      tl.eventCallback('onComplete', onComplete);
    }

    return () => {
      if (tl) {
        tl.kill();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);
}
