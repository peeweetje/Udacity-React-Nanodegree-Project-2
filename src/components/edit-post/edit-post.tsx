import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditPost, fetchSinglePost } from '../../redux/actions';
import MobileSidebar from '../dashboard-page/sidebar/mobile-sidebar/mobile-sidebar';
import Loading from '../loading/loading';
import { Edit } from 'lucide-react';
import BackButton from '@/components/ui/back-button';
import HamburgerButton from '@/components/ui/hamburger-button';
import { animateCards } from '../animations/card-animations';
import { useGsapContext } from '../animations/use-gsap-animation';
import { useTranslation } from 'react-i18next';

interface RootState {
  posts: {
    posts: Post[];
  };
}

interface Post {
  id: string;
  category: string;
  title: string;
  author: string;
  body: string;
}

import EditPostForm from './edit-post-form';
import type { FormValues } from './edit-post-form';

const EditPost = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const containerRef = useRef<HTMLDivElement>(null);

  const post = useSelector((state: RootState) =>
    state.posts.posts.find((p) => p.id === postId)
  );

  useEffect(() => {
    const loadPost = async () => {
      if (postId) {
        setIsLoading(true);
        await (fetchSinglePost(postId))(dispatch);
        setIsLoading(false);
      }
    };
    loadPost();
  }, [dispatch, postId]);

  useEffect(() => {
    if (post && !isLoading) {
      // Post data is available
    }
  }, [post, isLoading]);

  useGsapContext(containerRef as React.RefObject<HTMLDivElement | null>, () => {
    animateCards('.edit-post-card', animationsEnabled, 0.2, 0.3);
  }, [animationsEnabled, isLoading]);

  const handleSubmit = async (values: FormValues) => {
    if (!postId) return;
    const data = {
      id: postId,
      title: values.postTitle,
      body: values.postContent,
      author: values.postAuthor,
      category: values.postCategory,
    };
    await (fetchEditPost(data, postId))(dispatch);
    navigate(`/${values.postCategory}/${postId}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!post) {
    return <Loading />;
  }

  return (
    <div className='flex min-h-screen bg-neutral-10 dark:bg-gray-900'>
      {/* Mobile hamburger button */}
      <HamburgerButton onClick={() => setMobileMenuOpen(true)} />

      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className='flex-1 p-8'>
        <div className='mb-8 text-center'>
          <div className='mb-4'>
            <BackButton />
          </div>
          <h1 className=' text-teal-500 dark:text-teal-400 text-3xl font-bold text-primary dark:text-white'>
            <Edit className=' text-teal-500 dark:text-teal-400 inline-block mr-2' />
            {t('editPost.edit-post')}
          </h1>
        </div>
        <div ref={containerRef}>
          <div className='edit-post-card max-w-2xl mx-auto bg-card bg-neutral-100 dark:bg-gray-800 p-8 rounded-lg shadow-inner dark:border dark:border-gray-700'>
            <EditPostForm
              key={post.id}
              initialCategory={post.category}
              initialTitle={post.title}
              initialAuthor={post.author}
              initialContent={post.body}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;