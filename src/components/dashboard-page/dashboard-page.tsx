import React, { useEffect, useRef, useState } from 'react';
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
import gsap from 'gsap';
import { animateDashboardStats } from '../animations/dashboard-animations';
import { Post } from '../../types/post';

interface RootState {
  posts: {
    posts: Post[];
  };
  receiveCategories: Array<{ path: string; name: string }>;
  getComments: {
    comments: Array<any>;
  };
  animations: {
    enabled: boolean;
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
  const [animationDone, setAnimationDone] = useState(false);
  const statsGridRef = useRef<HTMLDivElement>(null);
  const animationsEnabled = useSelector((state: RootState) => state.animations?.enabled ?? true);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchCategories());
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (statsGridRef.current) {
      if (!animationsEnabled) {
        // Show stat cards immediately without animation
        const cards = statsGridRef.current.querySelectorAll('[data-dashboard-stat-card]');
        gsap.set(cards, { y: 0, opacity: 1 });
        setAnimationDone(true);
        return;
      }
      const grid = statsGridRef.current;
      const tl = animateDashboardStats(grid);
      tl.eventCallback('onComplete', () => {
        setAnimationDone(true);
      });
      return () => {
        tl.kill();
        setAnimationDone(true);
        gsap.killTweensOf(grid.querySelectorAll('[data-dashboard-stat-card]'));
      };
    }
  }, [animationsEnabled]);

  const activePosts = posts.filter((post) => !post.deleted);
  const hasNotifications = activePosts.length > 0 && !notificationsRead;
  const totalComments = activePosts.reduce(
    (sum, post) => sum + (post.comments?.length || 0),
    0
  );
  const totalVotes = activePosts.reduce(
    (sum, post) => sum + (post.voteScore || 0),
    0
  );

  const filteredPosts = searchQuery
    ? activePosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activePosts;

  const recentActivities = (searchQuery ? filteredPosts : activePosts)
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
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
            <Link
              to='/profile'
              aria-label={t('dashboard.profile')}
              title={t('dashboard.profile')}
              className='bg-teal-100 dark:bg-teal-900/50 p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-800/50 transition-colors'
            >
              <User className='h-6 w-6 text-teal-600' />
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className={`flex-1 p-4 md:p-8 ${animationDone ? 'overflow-y-auto' : 'overflow-hidden'} dark:bg-gray-900`}>
          {/* Stats cards */}
          <div ref={statsGridRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <DashboardStatCard
              icon={MessageSquare}
              label={t('dashboard.active-topics')}
              value={activePosts.length}
              trend={activePosts.length > 0 ? t('dashboard.total-topics', { count: activePosts.length }) : t('dashboard.total-topics', { count: 0 })}
              trendDirection='up'
            />
            <DashboardStatCard
              icon={Hash}
              label={t('dashboard.new-comments')}
              value={totalComments}
              trend={totalComments > 0 ? t('dashboard.total-comments', { count: totalComments }) : t('dashboard.total-comments', { count: 0 })}
              trendDirection='up'
            />
            <DashboardStatCard
              icon={TrendingUp}
              label={t('dashboard.trending-categories')}
              value={categories.length}
              trend={categories.length > 0 ? t('dashboard.total-categories', { count: categories.length }) : t('dashboard.total-categories', { count: 0 })}
              trendDirection='up'
            />
            <DashboardStatCard
              icon={Eye}
              label={t('dashboard.total-votes')}
              value={totalVotes}
              trend={totalVotes > 0 ? t('dashboard.total-votes-trend', { count: totalVotes }) : t('dashboard.total-votes-trend', { count: 0 })}
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