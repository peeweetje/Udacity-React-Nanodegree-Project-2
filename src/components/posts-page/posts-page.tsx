import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../redux/actions';
import { sortPosts } from '../../utils/sortPosts';
import { animateCards } from '../animations/card-animations';
import { animateCategoryText } from '../animations/text-animations';
import { useGsapContext, useGsapCardHover } from '../animations/use-gsap-animation';
import Loading from '../loading/loading';

import { Button } from '@/components/ui/button';
import {
  PlusCircle,
} from 'lucide-react';

import CategoryMenu from '../category-menu/category-menu';
import MobileSidebar from '../dashboard-page/sidebar/mobile-sidebar/mobile-sidebar';
import HamburgerButton from '@/components/ui/hamburger-button';
import Header from '@/components/header/header';
import { useTranslation } from 'react-i18next';
import { Post } from '../../types/post';
import PostCard from './post-card';

interface RootState {
  posts: {
    posts: Post[];
  };
  sort: {
    sort: {
      value: string;
    };
  };
}

const PostsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const sort = useSelector((state: RootState) => state.sort.sort);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(actions.fetchPosts());
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    };
    fetchData();
  }, [dispatch]);

  const deletePost = (postId: string) => {
    dispatch(actions.fetchDeletePost(postId));
  };

  const handleVotePost = (postId: string, option: 'upVote' | 'downVote') => {
    dispatch(actions.fetchVotePost(postId, option));
  };

  const postsContainerRef = useRef<HTMLDivElement>(null);

  useGsapContext(postsContainerRef as React.RefObject<HTMLDivElement | null>, () => {
    animateCards('.post-card', animationsEnabled, 0.2, 0.4);
    const container = postsContainerRef.current;
    if (container) {
      animateCategoryText(container, '[data-category-text]', animationsEnabled, 0.6);
    }
  }, [animationsEnabled, posts.length, loading]);
  // Note: Only depends on posts.length (triggers when posts are added/removed), not the full posts array.
  // This prevents re-animation on vote because voteScore changes don't affect array length.

  useGsapCardHover(
    postsContainerRef as React.RefObject<HTMLDivElement | null>,
    '.post-card',
    animationsEnabled,
    [loading]
  );
  // Note: Only depends on animationsEnabled and loading, not posts, so voting doesn't re-attach hover listeners.

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='flex min-h-screen bg-background dark:bg-gray-900 overflow-x-hidden'>
      {/* Mobile hamburger button */}
      <HamburgerButton onClick={() => setMobileMenuOpen(true)} />

      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} showNav={false} />
      <div className='flex-1 p-4 md:p-8 min-w-0'>
        <div className='container mx-auto'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-primary dark:text-white'>{t('common.git-talks')}</h1>
            <Header />
          </div>
          <CategoryMenu />
        </div>

        <div ref={postsContainerRef} className='grid gap-6 mt-8 w-full md:w-4/5 mx-auto'>
          {posts &&
            posts.length > 0 &&
            sortPosts(
              posts.filter((post) => !post.deleted),
              sort.value
            ).map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={deletePost}
                onVote={handleVotePost}
                animationsEnabled={animationsEnabled}
              />
            ))}
        </div>
        <div className='mt-8 text-center'>
          <Button asChild className='w-30'>
            <Link to='/addpost'>
              <PlusCircle className='h-4 w-4 mr-2' />
              {t('common.add-post')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostsPage;