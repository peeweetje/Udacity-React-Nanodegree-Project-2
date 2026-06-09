import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { animateSidebar } from '../../../animations/sidebar-animations';
import { navItems } from '../sidebar-nav-items';

const DesktopSidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);

  useEffect(() => {
    if (!sidebarRef.current) return;

    if (!animationsEnabled) {
      gsap.set(logoRef.current, { x: 0, opacity: 1 });
      if (navRef.current) {
        gsap.set(navRef.current.querySelectorAll('a'), { x: 0, opacity: 1 });
      }
      return;
    }

    animateSidebar({
      containerRef: sidebarRef.current,
      logoRef: logoRef.current,
      navRef: navRef.current,
    });
  }, [animationsEnabled]);

  return (
    <aside ref={sidebarRef} className='hidden md:flex w-64 bg-teal-500 min-h-screen flex-col py-8 px-4'>
      <div className='mb-10 px-4'>
        <h2 ref={logoRef} className='text-2xl font-bold text-white opacity-0'>{t('common.git-talks')}</h2>
      </div>
      <nav ref={navRef} className='flex flex-col space-y-2'>
        {navItems.map(({ to, icon: Icon, labelKey }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className='h-5 w-5' />
              <span>{t(labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DesktopSidebar;
