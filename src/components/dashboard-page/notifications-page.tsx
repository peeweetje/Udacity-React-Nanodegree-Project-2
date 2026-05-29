import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MessageSquare, User, PlusCircle, Bell } from 'lucide-react';
import { fetchPosts } from '../../redux/actions';
import DashboardSidebar from './dashboard-sidebar';
import BackButton from '@/components/ui/back-button';
import { Post } from '../../types/post';
import { animateListItems, animateEmptyState } from '../animations/list-entry-animations';
import { useGsapContext } from '../animations/use-gsap-animation';

interface RootState {
  posts: {
    posts: Post[];
  };
}

const NotificationsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const containerRef = useRef<HTMLDivElement>(null);
  const emptyStateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const activePosts = posts.filter((post) => !post.deleted);

  const notifications = activePosts
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
    .map((post) => {
      const commentCount = post.comments?.length || 0;
      const type = commentCount > 0 ? 'comment' : 'post';
      const label = type === 'comment'
        ? `${commentCount} new comment${commentCount > 1 ? 's' : ''}`
        : 'New post created';

      return {
        id: post.id,
        type,
        label,
        author: post.author,
        postTitle: post.title,
        category: post.category,
        timestamp: post.timestamp,
        icon: type === 'comment' ? MessageSquare : PlusCircle,
        iconBg: type === 'comment' ? 'bg-blue-100' : 'bg-green-100',
        iconColor: type === 'comment' ? 'text-blue-600' : 'text-green-600',
      };
    });

  useGsapContext(containerRef, () => {
    animateListItems({
      itemSelector: '.notification-card',
      enabled: animationsEnabled,
    });
  }, [posts, animationsEnabled, notifications.length]);

  useGsapContext(emptyStateRef, () => {
    animateEmptyState('.notification-empty-state', animationsEnabled);
  }, [notifications.length, animationsEnabled]);

  return (
    <div className='flex min-h-screen bg-gray-50 overflow-x-hidden'>
      <DashboardSidebar />
      <div className='flex-1 flex flex-col min-w-0'>
        <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pl-16 md:pl-8 pr-4 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <BackButton />
            <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
              {t('dashboard.notifications')}
            </h1>
          </div>
          <div className='bg-teal-100 p-2 rounded-full'>
            <Bell className='h-6 w-6 text-teal-600' />
          </div>
        </header>

        <main className='flex-1 p-4 md:p-8 overflow-y-auto dark:bg-gray-900'>
          {notifications.length === 0 && (
            <div ref={emptyStateRef} className='notification-empty-state opacity-0 text-center py-20'>
              <Bell className='h-16 w-16 text-gray-300 mx-auto mb-4' />
              <p className='text-gray-500 text-lg'>
                No notifications yet
              </p>
            </div>
          )}

          <div ref={containerRef} className='space-y-4 max-w-3xl mx-auto'>
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Link
                  key={notification.id}
                  to={`/${notification.category}/${notification.id}`}
                  className='notification-card opacity-0 block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-5 hover:shadow-md hover:border-teal-200 dark:hover:border-teal-600 transition-all duration-200'
                >
                  <div className='flex items-start space-x-3 md:space-x-4'>
                    <div className={`${notification.iconBg} p-2 md:p-3 rounded-full flex-shrink-0`}>
                      <Icon className={`h-4 w-4 md:h-5 md:w-5 ${notification.iconColor}`} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm text-gray-900 dark:text-white font-medium truncate'>
                        {notification.label}
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-300 mt-1 truncate'>
                        {notification.postTitle}
                      </p>
                      <div className='flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-400 dark:text-gray-500'>
                        <span className='flex items-center space-x-1'>
                          <User className='h-3 w-3' />
                          <span>{notification.author}</span>
                        </span>
                        <span>{notification.category}</span>
                        <span>{new Date(notification.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;