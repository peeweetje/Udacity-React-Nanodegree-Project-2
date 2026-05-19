import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Bell, Settings, MessageSquare, List, User } from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ElementType;
  labelKey: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: Home, labelKey: 'dashboard.home' },
  { to: '/profile', icon: User, labelKey: 'dashboard.profile' },
  { to: '/posts', icon: List, labelKey: 'dashboard.categories' },
  { to: '/notifications', icon: Bell, labelKey: 'dashboard.notifications' },
  { to: '/settings', icon: Settings, labelKey: 'dashboard.settings' },
  { to: '/messages', icon: MessageSquare, labelKey: 'dashboard.messages' },
];

const DesktopSidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <aside className='hidden md:flex w-64 bg-teal-500 min-h-screen flex-col py-8 px-4'>
      <div className='mb-10 px-4'>
        <h2 className='text-2xl font-bold text-white'>{t('common.git-talks')}</h2>
      </div>
      <nav className='flex flex-col space-y-2'>
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