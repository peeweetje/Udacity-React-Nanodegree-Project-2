import { Home, Bell, Settings, MessageSquare, List, User, LayoutDashboard } from 'lucide-react';
import { NavItem } from './sidebar-types';

export const navItems: NavItem[] = [
  { to: '/', icon: Home, labelKey: 'dashboard.home' },
  { to: '/home', icon: LayoutDashboard, labelKey: 'dashboard.dashboard' },
  { to: '/profile', icon: User, labelKey: 'dashboard.profile' },
  { to: '/posts', icon: List, labelKey: 'dashboard.categories' },
  { to: '/notifications', icon: Bell, labelKey: 'dashboard.notifications' },
  { to: '/settings', icon: Settings, labelKey: 'dashboard.settings' },
  { to: '/messages', icon: MessageSquare, labelKey: 'dashboard.messages' },
];