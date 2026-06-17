import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';
import { fetchPosts } from '../../../redux/actions';
import DashboardSidebar from '../sidebar/dashboard-sidebar';
import BackButton from '@/components/ui/back-button';
import { Post } from '../../../types/post';
import { Comment } from '../../../utils/api';
import { animateListItems, animateEmptyState } from '../../animations/list-entry-animations';
import { useGsapContext } from '../../animations/use-gsap-animation';
import MessageCard from './message-card';
import EmptyMessages from './empty-messages';

interface RootState {
  posts: {
    posts: Post[];
  };
}

const MessagesPage = () => {
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

  const allComments: Array<{
    comment: Comment;
    postTitle: string;
    postCategory: string;
    postId: string;
  }> = [];

  activePosts.forEach((post) => {
    if (post.comments && post.comments.length > 0) {
      post.comments.forEach((comment: Comment) => {
        if (!comment.deleted && !comment.parentDeleted) {
          allComments.push({
            comment,
            postTitle: post.title,
            postCategory: post.category,
            postId: post.id,
          });
        }
      });
    }
  });

  allComments.sort((a, b) => b.comment.timestamp - a.comment.timestamp);

  useGsapContext(containerRef, () => {
    animateListItems({
      itemSelector: '.message-card',
      enabled: animationsEnabled,
    });
  }, [posts, animationsEnabled, allComments.length]);

  useGsapContext(emptyStateRef, () => {
    animateEmptyState('.messages-empty-state', animationsEnabled);
  }, [allComments.length, animationsEnabled]);

  return (
    <div className='flex min-h-screen bg-gray-50 overflow-x-hidden'>
      <DashboardSidebar />
      <div className='flex-1 flex flex-col min-w-0'>
        <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pl-16 md:pl-8 pr-4 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <BackButton />
            <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
              {t('dashboard.messages')}
            </h1>
          </div>
          <div className='bg-teal-100 p-2 rounded-full'>
            <MessageSquare className='h-6 w-6 text-teal-600' />
          </div>
        </header>

        <main className='flex-1 p-4 md:p-8 overflow-y-auto dark:bg-gray-900'>
          {allComments.length === 0 && (
            <EmptyMessages innerRef={emptyStateRef} />
          )}

          <div ref={containerRef} className='space-y-4 max-w-3xl mx-auto'>
            {allComments.map(({ comment, postTitle, postCategory, postId }) => (
              <MessageCard
                key={comment.id}
                comment={comment}
                postTitle={postTitle}
                postCategory={postCategory}
                postId={postId}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessagesPage;