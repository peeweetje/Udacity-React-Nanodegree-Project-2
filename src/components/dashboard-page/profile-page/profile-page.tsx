import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../../redux/actions';
import DashboardSidebar from '../sidebar/dashboard-sidebar';
import ProfileAvatar from './profile-avatar';
import ProfileInfo from './profile-info';
import AnimatedOrbs from '../../animations/animated-orbs';
import { Post } from '../../../types/post';

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
    <div className='flex min-h-screen bg-white overflow-x-hidden'>
      <DashboardSidebar />
      <div className='flex-1 flex flex-col min-w-0'>
        <header className='bg-card dark:bg-gray-800 border-b border-teal-500 dark:border-gray-700 pl-16 md:pl-8 pr-4 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <BackButton />
            <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
              {t('dashboard.profile')}
            </h1>
          </div>
        </header>

        <main className='flex-1 p-4 md:p-8 overflow-y-auto dark:bg-gray-900 relative'>
          <AnimatedOrbs />
          <div className='max-w-2xl mx-auto relative z-10'>
            <div className='bg-card dark:bg-gray-800 rounded-xl shadow-sm border border-teal-500 dark:border-gray-700 p-6 md:p-8'>
              <ProfileAvatar userName={userName} />
              <ProfileInfo
                userName={userName}
                memberSinceDate={memberSinceDate}
                postsCount={userPosts.length}
                commentCount={userCommentCount}
                totalVotes={totalVotes}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;