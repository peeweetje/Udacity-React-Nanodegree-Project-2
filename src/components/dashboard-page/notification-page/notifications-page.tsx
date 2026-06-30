import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Edit, Bell } from 'lucide-react';
import { fetchPosts } from '../../../redux/actions';
import DashboardSidebar from '../sidebar/dashboard-sidebar';
import NoNotificationsMessage from './NoNotificationsMessage';
import BackButton from '@/components/ui/back-button';
import { Post } from '../../../types/post';
import { animateListItems, animateEmptyState } from '../../animations/list-entry-animations';
import { useGsapContext } from '../../animations/use-gsap-animation';
import NotificationCard from './notification-card';

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

  // For each post, determine the latest activity timestamp (post timestamp or latest comment timestamp)
  const postsWithActivity = activePosts.map((post) => {
    const commentCount = post.comments?.length || 0;
    let latestActivityTimestamp = post.timestamp;
    
    if (commentCount > 0 && post.comments) {
      const latestComment = post.comments.reduce((latest, comment) => 
        comment.timestamp > latest.timestamp ? comment : latest
      );
      latestActivityTimestamp = latestComment.timestamp;
    }
    
    return {
      ...post,
      _latestActivityTimestamp: latestActivityTimestamp,
      _commentCount: commentCount
    };
  });

  const notifications = postsWithActivity
    .sort((a, b) => b._latestActivityTimestamp - a._latestActivityTimestamp)
    .slice(0, 10)
    .map((post) => {
      const commentCount = post._commentCount;
      const type: 'comment' | 'post' = commentCount > 0 ? 'comment' : 'post';
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
        timestamp: post._latestActivityTimestamp,
        icon: type === 'comment' ? MessageSquare : Edit,
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
    <div className='flex min-h-screen bg-white overflow-x-hidden'>
      <DashboardSidebar />
      <div className='flex-1 flex flex-col min-w-0'>
        <header className='bg-card dark:bg-gray-800 border-b border-teal-500 dark:border-gray-700 pl-16 md:pl-8 pr-4 py-4 flex items-center justify-between'>
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
            <NoNotificationsMessage ref={emptyStateRef} />
          )}

          <div ref={containerRef} className='space-y-4 max-w-3xl mx-auto'>
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;