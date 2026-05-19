import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { User, Mail, Calendar, MessageSquare, ThumbsUp, FileText } from 'lucide-react';
import BackButton from '@/components/ui/back-button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../redux/actions';
import DashboardSidebar from './dashboard-sidebar';
import { Post } from '../../types/post';

interface RootState {
  posts: {
    posts: Post[];
  };
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const location = useLocation();
  const posts = useSelector((state: RootState) => state.posts.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch, location.pathname]);

  const userName = 'Petra Vos';
  const userPosts = posts.filter((post) => !post.deleted && post.author === userName);

  // Comments made by Petra Vos on all posts
  let userCommentCount = 0;
  const activePosts = posts.filter((post) => !post.deleted);
  activePosts.forEach((post) => {
    if (post.comments && post.comments.length > 0) {
      post.comments.forEach((comment: any) => {
        if (!comment.deleted && !comment.parentDeleted && comment.author === userName) {
          userCommentCount++;
        }
      });
    }
  });

  const totalVotes = userPosts.reduce(
    (sum, post) => sum + (post.voteScore || 0),
    0
  );

  // Derive member since from the earliest post timestamp
  const timestamps = userPosts.map((p) => p.timestamp).filter(Boolean);
  const memberSinceDate = timestamps.length > 0
    ? new Date(Math.min(...timestamps)).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : null;

  return (
    <div className='flex min-h-screen bg-gray-50 overflow-x-hidden'>
      <DashboardSidebar />
      <div className='flex-1 flex flex-col min-w-0'>
        <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pl-16 md:pl-8 pr-4 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <BackButton />
            <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
              {t('dashboard.profile')}
            </h1>
          </div>
        </header>

        <main className='flex-1 p-4 md:p-8 overflow-y-auto dark:bg-gray-900'>
          <div className='max-w-2xl mx-auto'>
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8'>
              {/* Avatar section */}
              <div className='flex flex-col items-center mb-8'>
                <div className='w-24 h-24 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4'>
                  <User className='h-12 w-12 text-teal-600' />
                </div>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {userName}
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  @{userName.toLowerCase().replace(/\s+/g, '')}
                </p>
              </div>

              {/* Profile info */}
              <div className='space-y-4'>
                <div className='flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                  <Mail className='h-5 w-5 text-teal-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    {userName.toLowerCase().replace(/\s+/g, '')}@example.com
                  </span>
                </div>
                <div className='flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                  <Calendar className='h-5 w-5 text-teal-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    {t('dashboard.member-since')}{memberSinceDate ? ` ${memberSinceDate}` : ''}
                  </span>
                </div>
                <div className='flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                  <FileText className='h-5 w-5 text-teal-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    {userPosts.length} {t('dashboard.posts-count')}
                  </span>
                </div>
                <div className='flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                  <MessageSquare className='h-5 w-5 text-teal-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    {userCommentCount} {t('dashboard.comments-made')}
                  </span>
                </div>
                <div className='flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                  <ThumbsUp className='h-5 w-5 text-teal-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    {totalVotes} {t('dashboard.votes-received')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;