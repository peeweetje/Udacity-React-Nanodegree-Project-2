import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Bell, Settings, MessageSquare, List } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/actions';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';

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

  useEffect(() => {
    if (showCategories) {
      dispatch(fetchCategories() as any);
    }
  }, [dispatch, showCategories]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <SheetContent
          className='w-[250px] sm:w-[300px] bg-teal-500 overflow-y-auto [&_.lucide-x]:text-white'
          side='left'
        >
        <SheetTitle className='text-2xl font-bold text-white py-4 px-4'>
          {t('common.git-talks')}
        </SheetTitle>

        {showNav && (
          <nav className='flex flex-col space-y-1 px-4 mt-6'>
            {navItems.map(({ to, icon: Icon, labelKey }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className='h-5 w-5' />
                  <span>{t(labelKey)}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {showCategories && receiveCategories.length > 0 && (
          <div className={`${showNav ? 'border-t border-white/20 pt-6 px-4 mt-4' : 'px-4 mt-6'}`}>
            <p className='text-xs font-semibold text-white/50 uppercase tracking-wider mb-4'>
              {t('common.categories')}
            </p>
            <nav className='flex flex-col space-y-2'>
              {receiveCategories.map((category) => (
                <Link
                  key={category.path}
                  to={`/${category.name}`}
                  onClick={onClose}
                  className='text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors duration-200'
                >
                  {category.name.charAt(0).toUpperCase() +
                    category.name.slice(1)}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;