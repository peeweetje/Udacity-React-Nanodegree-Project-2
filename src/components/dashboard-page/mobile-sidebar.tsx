import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Bell, Settings, MessageSquare, List, Hash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/actions';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import gsap from 'gsap';

interface Category {
  path: string;
  name: string;
}

interface RootState {
  receiveCategories: Category[];
}

interface NavItem {
  to: string;
  icon: React.ElementType;
  labelKey: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: Home, labelKey: 'dashboard.home' },
  { to: '/posts', icon: List, labelKey: 'dashboard.categories' },
  { to: '/notifications', icon: Bell, labelKey: 'dashboard.notifications' },
  { to: '/settings', icon: Settings, labelKey: 'dashboard.settings' },
  { to: '/messages', icon: MessageSquare, labelKey: 'dashboard.messages' },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  showNav?: boolean;
  showCategories?: boolean;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, showNav = true, showCategories = true }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const receiveCategories = useSelector(
    (state: RootState) => state.receiveCategories
  );

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
    if (!isOpen) return;

    let isCancelled = false;
    let rafId: number;

    const animate = () => {
      if (isCancelled) return;
      // Wait for sheet content and logo (always rendered) to be available
      if (!sheetContentRef.current || !logoRef.current) {
        rafId = requestAnimationFrame(animate);
        return;
      }
      // If showNav is true, wait for nav too
      if (showNav && !navRef.current) {
        rafId = requestAnimationFrame(animate);
        return;
      }
      // If showCategories is true and categories exist, wait for categories ref
      if (showCategories && receiveCategories.length > 0 && !categoriesRef.current) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      // Disable CSS transitions that conflict
      sheetContentRef.current.querySelectorAll('a').forEach(link => {
        link.style.setProperty('transition', 'none', 'important');
      });

      // Use fromTo to set AND animate in one GSAP call — no flash
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Logo: immediately hidden at -60px, then slides in
      tl.fromTo(logoRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.0 }
      );

      // Nav items: hidden at -50px, stagger in
      if (navRef.current) {
        const navLinks = navRef.current.querySelectorAll('a');
        if (navLinks.length > 0) {
          tl.fromTo(navLinks,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
            '-=0.3'
          );
        }
      }

      // Categories section
      if (categoriesRef.current) {
        const catLabel = categoriesRef.current.querySelector('.categories-label');
        if (catLabel) {
          tl.fromTo(catLabel,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5 },
            '-=0.2'
          );
        }
        const catLinks = categoriesRef.current.querySelectorAll('a');
        if (catLinks.length > 0) {
          tl.fromTo(catLinks,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
            '-=0.2'
          );
        }
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(rafId);
      gsap.killTweensOf('*');
    };
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        ref={sheetContentRef}
        className='w-[250px] sm:w-[300px] overflow-y-auto overflow-x-hidden border-r border-teal-600/10 [&_.lucide-x]:text-teal-600/50 [&_.lucide-x]:hover:text-teal-400 [&_.lucide-x]:transition-colors'
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
                          : 'text-teal-600/70 hover:text-teal-400 hover:bg-teal-600/10'
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
                            : 'text-teal-500/70 hover:text-teal-400 hover:bg-teal-500/10'
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