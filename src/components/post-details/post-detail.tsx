import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import CategoryMenu from '../category-menu/category-menu';
import MobileSidebar from '../dashboard-page/sidebar/mobile-sidebar/mobile-sidebar';
import HamburgerButton from '@/components/ui/hamburger-button';
import BackButton from '@/components/ui/back-button';
import SinglePost from './single-post';
import SingleComment from './single-comment';
import AddCommentForm from './add-comment-form';
import PostNotFound from './post-not-found';
import { usePostDetail } from './use-post-detail';

const PostDetail = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const {
    commentAuthor,
    commentContent,
    comments,
    filteredPosts,
    sortedComments,
    animationsEnabled,
    handleInputChange,
    handleSubmit,
    deletePost,
    onDeleteComment,
    iconThumbsUp,
    iconThumbsDown,
    iconThumbsUpComment,
    iconThumbsDownComment,
  } = usePostDetail();

  return (
    <div className='flex min-h-screen bg-background dark:bg-gray-900'>
      {/* Mobile hamburger button */}
      <HamburgerButton onClick={() => setMobileMenuOpen(true)} />

      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className='flex-1 p-8'>
        <div className='flex flex-col items-center mb-8'>
          <h1 className='text-3xl font-bold text-center text-primary dark:text-white mb-4'>
            {t('common.git-talks')}
          </h1>
          <BackButton />
        </div>
        <CategoryMenu />
        <div ref={contentContainerRef} className='w-4/5 mx-auto'>
          {filteredPosts?.map((post) => (
            <SinglePost
              key={post.id}
              post={post}
              commentsCount={comments?.length || 0}
              onUpvote={iconThumbsUp}
              onDownvote={iconThumbsDown}
              onDelete={deletePost}
            />
          ))}

          <div className='mt-8'>
            {sortedComments?.map((comment) => (
              <SingleComment
                key={comment.id}
                comment={comment}
                onUpvote={iconThumbsUpComment}
                onDownvote={iconThumbsDownComment}
                onDelete={onDeleteComment}
              />
            ))}

            {filteredPosts?.length > 0 ? (
              <AddCommentForm
                commentAuthor={commentAuthor}
                commentContent={commentContent}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                animationsEnabled={animationsEnabled}
                commentsCount={comments?.length || 0}
              />
            ) : (
              <PostNotFound />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;