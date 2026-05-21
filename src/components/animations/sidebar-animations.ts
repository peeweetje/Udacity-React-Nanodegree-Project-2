import gsap from 'gsap';
import { RefObject } from 'react';

interface SidebarAnimationOptions {
  /** The container element whose anchor tags will have CSS transitions disabled */
  containerRef: HTMLElement;
  /** The logo/title element to animate (slides in from left) */
  logoRef: HTMLElement | null;
  /** The nav element whose child anchor links will be staggered */
  navRef: HTMLElement | null;
  /** Optional category label element */
  categoryLabelRef?: HTMLElement | null;
  /** Optional category nav element whose child anchor links will be staggered */
  categoryNavRef?: HTMLElement | null;
}

interface PollingOptions {
  /** React ref for the container element */
  containerRef: RefObject<any>;
  /** React ref for the logo/title element */
  logoRef: RefObject<any>;
  /** React ref for the nav element */
  navRef?: RefObject<any>;
  /** Whether nav items are expected to render */
  hasNav?: boolean;
  /** Whether categories are expected to render */
  hasCategories?: boolean;
}

/**
 * Plays a GSAP stagger-in animation for a sidebar.
 * Logo slides in from the left, then nav links stagger in,
 * followed by optional category label and category links.
 */
export function animateSidebar({
  containerRef,
  logoRef,
  navRef,
  categoryLabelRef,
  categoryNavRef,
}: SidebarAnimationOptions) {
  // Disable CSS transitions that conflict with GSAP
  containerRef.querySelectorAll('a').forEach((link) => {
    link.style.setProperty('transition', 'none', 'important');
  });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Logo: slide in from the left
  if (logoRef) {
    tl.fromTo(
      logoRef,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.0 }
    );
  }

  // Nav items: stagger in from the left
  if (navRef) {
    const navLinks = navRef.querySelectorAll('a');
    if (navLinks.length > 0) {
      tl.fromTo(
        navLinks,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
        '-=0.3'
      );
    }
  }

  // Category label
  if (categoryLabelRef) {
    tl.fromTo(
      categoryLabelRef,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5 },
      '-=0.2'
    );
  }

  // Category links: stagger in from below
  if (categoryNavRef) {
    const catLinks = categoryNavRef.querySelectorAll('a');
    if (catLinks.length > 0) {
      tl.fromTo(
        catLinks,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
        '-=0.2'
      );
    }
  }

  return tl;
}

/**
 * Polls with requestAnimationFrame until all required DOM elements are available,
 * then runs the animation. Used for sheet/modal sidebars where content renders async.
 * Returns a cleanup function that should be called in useEffect's return.
 */
export function animateSidebarWithPolling(options: PollingOptions) {
  const { containerRef, logoRef, navRef, hasNav, hasCategories } = options;
  let isCancelled = false;
  let rafId: number;

  const checkReady = () => {
    const container = containerRef.current;
    const logo = logoRef.current;
    if (!container || !logo) return false;

    if (hasNav) {
      if (!navRef?.current) return false;
      const links = navRef.current.querySelectorAll('a');
      if (links.length === 0) return false;
    }

    if (hasCategories) {
      const catLabel = container.querySelector('.categories-label');
      if (!catLabel) return false;
    }

    return true;
  };

  const animate = () => {
    if (isCancelled) return;
    if (!checkReady()) {
      rafId = requestAnimationFrame(animate);
      return;
    }

    const container = containerRef.current!;
    const logo = logoRef.current!;
    const nav = navRef?.current ?? null;
    const catLabelEl = container.querySelector('.categories-label') as HTMLElement | null;
    const catNavEl = container.querySelector('[data-category-nav]') as HTMLElement | null;

    animateSidebar({
      containerRef: container,
      logoRef: logo,
      navRef: nav,
      categoryLabelRef: catLabelEl,
      categoryNavRef: catNavEl,
    });
  };

  rafId = requestAnimationFrame(animate);

  return () => {
    isCancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
    gsap.killTweensOf('*');
  };
}
