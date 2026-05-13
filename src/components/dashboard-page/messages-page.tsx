import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock } from 'lucide-react';
import { fetchPosts } from '../../redux/actions';
import DashboardSidebar from './dashboard-sidebar';
import BackButton from '@/components/ui/back-button';
import { Post } from '../../types/post';
import { Comment } from '../../utils/api';

interface RootState {
  posts: {
    posts: Post[];
  };
}

const MessagesPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const posts = useSelector((state: RootState) => state.posts.posts);

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
            <div className='text-center py-20'>
              <MessageSquare className='h-16 w-16 text-gray-300 mx-auto mb-4' />
              <p className='text-gray-500 text-lg'>
                No messages yet
              </p>
              <p className='text-gray-400 text-sm mt-2'>
                Comments on posts will appear here
              </p>
            </div>
          )}

          <div className='space-y-4 max-w-3xl mx-auto'>
            {allComments.map(({ comment, postTitle, postCategory, postId }) => (
              <Link
                key={comment.id}
                to={`/${postCategory}/${postId}`}
                className='block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-5 hover:shadow-md hover:border-teal-200 dark:hover:border-teal-600 transition-all duration-200'
              >
                <div className='flex items-start space-x-3 md:space-x-4'>
                  <div className='bg-teal-50 p-2 md:p-3 rounded-full flex-shrink-0'>
                    <MessageSquare className='h-4 w-4 md:h-5 md:w-5 text-teal-600' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='text-sm'>
                      <span className='font-medium text-gray-900 dark:text-white'>{comment.author}</span>
                      <span className='text-gray-400 mx-1'>commented on</span>
                      <span className='font-medium text-teal-600'>{postTitle}</span>
                    </div>
                      <p className='text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2'>
                      {comment.body}
                    </p>
                      <div className='flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-400 dark:text-gray-500'>
                      <span className='flex items-center space-x-1'>
                        <Clock className='h-3 w-3' />
                        <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                      </span>
                      <span>{postCategory}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessagesPage;