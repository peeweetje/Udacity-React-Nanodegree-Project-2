import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Hash,
  TrendingUp,
  Eye,
  User,
  Bell,
} from 'lucide-react';
import { fetchPosts, fetchCategories } from '../../redux/actions';
import DashboardSidebar from './dashboard-sidebar';
import DashboardSearch from './dashboard-search';
import DashboardStatCard from './dashboard-stat-card';
import DashboardRecentActivity from './dashboard-recent-activity';
import { Post } from '../../types/post';

interface RootState {
  posts: {
    posts: Post[];
  };
  receiveCategories: Array<{ path: string; name: string }>;
  getComments: {
    comments: Array<any>;
  };
}

const DashboardPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const location = useLocation();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const categories = useSelector((state: RootState) => state.receiveCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsRead, setNotificationsRead] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchCategories());
  }, [dispatch, location.pathname]);

  const activePosts = posts.filter((post) => !post.deleted);
  const hasNotifications = activePosts.length > 0 && !notificationsRead;
  const totalComments = activePosts.reduce(
    (sum, post) => sum + (post.comments?.length || 0),
    0
  );

  const filteredPosts = searchQuery
    ? activePosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activePosts;

  const recentActivities = filteredPosts
    .slice(0, 5)
    .map((post) => ({
      topic: post.title,
      category: post.category,
      date: new Date(post.timestamp).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }),
      status: (post.voteScore > 0 ? 'active' : 'resolved') as 'active' | 'resolved',
    }));

  return (
    <div className='flex min-h-screen bg-gray-50 overflow-x-hidden'>
      <DashboardSidebar />
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Top bar */}
        <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pl-16 md:pl-8 pr-4 py-4 flex items-center justify-between'>
          <DashboardSearch value={searchQuery} onChange={setSearchQuery} />
          <div className='flex items-center space-x-3'>
            <Link
              to='/notifications'
              className='relative bg-teal-100 dark:bg-teal-900/50 p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-800/50 transition-colors'
              onMouseEnter={() => setNotificationsRead(true)}
            >
              <Bell className='h-6 w-6 text-teal-600' />
              {hasNotifications && (
                <span className='absolute -top-0.5 -right-0.5 flex h-4 w-4'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75' />
                  <span className='relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold'>
                    {activePosts.length > 9 ? '9+' : activePosts.length}
                  </span>
                </span>
              )}
            </Link>
            <div className='bg-teal-100 dark:bg-teal-900/50 p-2 rounded-full'>
              <User className='h-6 w-6 text-teal-600' />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className='flex-1 p-4 md:p-8 overflow-y-auto dark:bg-gray-900'>
          {/* Stats cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <DashboardStatCard
              icon={MessageSquare}
              label={t('dashboard.active-topics')}
              value={activePosts.length}
              trend={`${activePosts.length > 0 ? '+12%' : '0%'} this week`}
              trendDirection='up'
            />
            <DashboardStatCard
              icon={Hash}
              label={t('dashboard.new-comments')}
              value={totalComments}
              trend={`+${totalComments > 0 ? '8%' : '0%'} this week`}
              trendDirection='up'
            />
            <DashboardStatCard
              icon={TrendingUp}
              label={t('dashboard.trending-categories')}
              value={categories.length}
              trend='+2 new categories'
              trendDirection='up'
            />
            <DashboardStatCard
              icon={Eye}
              label={t('dashboard.page-views')}
              value={filteredPosts.length > 0 ? '1,234' : '0'}
              trend={filteredPosts.length > 0 ? '+5%' : '0%'}
              trendDirection='up'
            />
          </div>

          {/* Recent activity */}
          <DashboardRecentActivity activities={recentActivities} />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;