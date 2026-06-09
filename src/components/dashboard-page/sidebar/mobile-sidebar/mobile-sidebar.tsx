import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hash, MessageSquare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../../redux/actions';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import { animateSidebar } from '../../../animations/sidebar-animations';
import { RootState, MobileSidebarProps } from './mobile-sidebar-types';
import { navItems } from './mobile-sidebar-nav-items';

const MobileSidebar = ({ isOpen, onClose, showNav = true, showCategories = true }: MobileSidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const receiveCategories = useSelector(
    (state: RootState) => state.receiveCategories
  );
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);

  const sheetContentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showCategories) {
      dispatch(fetchCategories() as any);
    }
  }, [dispatch, showCategories]);

  useEffect(() => {
    if (!isOpen || !animationsEnabled) return;

    // Wait one frame for the Radix Portal to render content into DOM
    const raf = requestAnimationFrame(() => {
      const container = sheetContentRef.current;
      const logo = logoRef.current;
      if (!container || !logo) return;

      const nav = navRef.current;
      const catLabelEl = container.querySelector('.categories-label') as HTMLElement | null;
      const catNavEl = container.querySelector('[data-category-nav]') as HTMLElement | null;

      animateSidebar({
        containerRef: container,
        logoRef: logo,
        navRef: nav,
        categoryLabelRef: catLabelEl,
        categoryNavRef: catNavEl,
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [isOpen, animationsEnabled]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        ref={sheetContentRef}
        className='w-[250px] sm:w-[300px] overflow-y-auto overflow-x-hidden border-r border-teal-600/10 data-[state=open]:animate-none data-[state=closed]:animate-none [&_.lucide-x]:text-teal-600/50 [&_.lucide-x]:hover:text-teal-400 [&_.lucide-x]:transition-colors'
        side='left'
      >
        {/* Dark gradient background */}
        <div className='absolute inset-0 bg-gradient-to-b from-[#0f0f13] via-[#15151c] to-[#1a1a24] pointer-events-none' />
        {/* Subtle grid pattern */}
        <div className='absolute inset-0 opacity-[0.02] pointer-events-none' style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Content - relative to sit above background */}
        <div className='relative z-10'>
          <SheetTitle
            ref={logoRef}
            className='text-2xl font-bold text-teal-600 py-6 px-4 tracking-tight flex items-center gap-2 opacity-0'
          >
            <span className='inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600/15 backdrop-blur-sm'>
              <MessageSquare className='h-4 w-4 text-teal-600' />
            </span>
            {t('common.git-talks')}
          </SheetTitle>

          <div className='px-3'>
            {showNav && (
              <nav ref={navRef} className='flex flex-col space-y-0.5 mb-2'>
                {navItems.map(({ to, icon: Icon, labelKey }) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={onClose}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-teal-600/15 text-teal-400 shadow-sm'
                  : 'text-teal-300/85 hover:text-teal-200 hover:bg-teal-600/10'
              }`}
                    >
                      <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-teal-600/20'
                          : 'bg-teal-600/5 group-hover:bg-teal-600/15'
                      }`}>
                        <Icon className='h-4 w-4' />
                      </span>
                      <span>{t(labelKey)}</span>
                    </Link>
                  );
                })}
              </nav>
            )}

            {showCategories && receiveCategories.length > 0 && (
              <div
                ref={categoriesRef}
                data-category-nav
                className={`${showNav ? 'border-t border-teal-600/10 mt-2 pt-5' : ''}`}
              >
                <p className='categories-label text-[11px] font-semibold text-teal-500/60 uppercase tracking-[0.12em] mb-3 px-3 flex items-center gap-2'>
                  <span className='w-4 h-px bg-teal-500/30' />
                  {t('common.categories')}
                </p>
                <nav className='flex flex-col space-y-0.5'>
                  {receiveCategories.map((category) => {
                    const categoryPath = `/${category.name}`;
                    const isCategoryActive = location.pathname === categoryPath;
                    const categoryKey = category.name.toLowerCase();
                    const categoryLabel = t(`common.${categoryKey}`) !== `common.${categoryKey}`
                      ? t(`common.${categoryKey}`)
                      : category.name.charAt(0).toUpperCase() + category.name.slice(1);
                    return (
                      <Link
                        key={category.path}
                        to={categoryPath}
                        onClick={onClose}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isCategoryActive
                  ? 'bg-teal-500/15 text-emerald-400 shadow-sm'
                  : 'text-teal-300/85 hover:text-teal-200 hover:bg-teal-500/10'
              }`}
                      >
                        <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                          isCategoryActive
                            ? 'bg-teal-500/20'
                            : 'bg-teal-500/5 group-hover:bg-teal-500/15'
                        }`}>
                          <Hash className='h-3.5 w-3.5' />
                        </span>
                        <span>{categoryLabel}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;