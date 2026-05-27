import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import gsap from 'gsap';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import CategoryItem from '../category-item/catergory-item';
import Menu from '../menu/menu';
import MobileSidebar from '../dashboard-page/mobile-sidebar';
import HamburgerButton from '@/components/ui/hamburger-button';
import BackButton from '@/components/ui/back-button';
import { sortPosts } from '../../utils/sortPosts';
import * as actions from '../../redux/actions';
import { useTranslation } from 'react-i18next';
import { Post } from '../../types/post';
import { VoteOption } from '../../utils/api';
import { animateCards, animateCardHover } from '../animations/card-animations';

interface SortState {
  value: string;
}

interface RootState {
  posts: {
    posts: Post[];
  };
  sort: {
    sort: SortState;
  };
}

const Categories = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const { posts } = useSelector((state: RootState) => state.posts);
  const sort = useSelector((state: RootState) => state.sort.sort);
  const { category: categoryName } = useParams<{ category: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const categoryCardContainerRef = useRef<HTMLDivElement>(null);
  const addPostBtnContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (categoryName) {
      dispatch(actions.fetchPostsCategory(categoryName));
    }
  }, [categoryName, dispatch, sort]);

  const handleDeletePost = (postId: string) => {
    dispatch(actions.fetchDeletePost(postId));
  };

  const handleVotePost = (postId: string, option: VoteOption) => {
    dispatch(actions.fetchVotePost(postId, option));
  };
  useEffect(() => {
    const ctx = gsap.context(() => {
      animateCards('.category-post-card', animationsEnabled, 0.2, 0.3);
    }, listContainerRef);

    return () => ctx.revert();
  }, [animationsEnabled, posts.length]);
  // Note: Only depends on posts.length (triggers when posts are added/removed), not the full posts array.
  // This prevents re-animation on vote because voteScore changes don't affect array length.

  useEffect(() => {
    if (!animationsEnabled) return;
    const cards = listContainerRef.current?.querySelectorAll('.category-post-card');
    if (!cards) return;
    const hoverCleanups = Array.from(cards).map(card => animateCardHover(card));
    return () => {
      hoverCleanups.forEach(cleanup => cleanup());
    };
  }, [animationsEnabled]);
  // Note: Only depends on animationsEnabled, not posts, so voting doesn't re-attach hover listeners.

  useEffect(() => {
    const ctx = gsap.context(() => {
      animateCards('.formatted-category-card', animationsEnabled, 0.2, 0.3);
    }, categoryCardContainerRef);

    return () => ctx.revert();
  }, [animationsEnabled]);
  // Note: Only depends on animationsEnabled, not posts, so voting doesn't re-trigger the animation.

  useEffect(() => {
    const ctx = gsap.context(() => {
      animateCards('.add-post-btn', animationsEnabled, 0.2, 0.5);
    }, addPostBtnContainerRef);

    return () => ctx.revert();
  }, [animationsEnabled]);
  // Animates the add post button on mount.

  const formattedCategoryName = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : '';

  const filteredAndSortedPosts: Post[] =
    posts && posts.length > 0
      ? sortPosts(
          posts.filter((post) => !post.deleted && !post.error),
          sort.value
        )
      : [];

  return (
    <div className='flex min-h-screen bg-background dark:bg-gray-900'>
      {/* Mobile hamburger button */}
      <HamburgerButton onClick={() => setMobileMenuOpen(true)} />

      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className='flex-1 p-8'>
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold text-primary dark:text-white mb-4'>
            {t('common.git-talks')}
          </h1>
          <div className='mb-4'>
            <BackButton />
          </div>
          <div className='mt-4 mb-6 flex justify-center'>
            <Menu />
          </div>
          <div ref={categoryCardContainerRef} className='flex justify-center'>
            <Card className='formatted-category-card w-auto dark:bg-gray-800 dark:border-gray-700'>
              <CardContent className='p-4 bg-teal-100 dark:bg-teal-900/50'>
                <p className='text-lg font-semibold text-primary dark:text-white'>
                  {t('common.category')} : {formattedCategoryName}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div ref={listContainerRef} className='mt-4 space-y-4'>
          {filteredAndSortedPosts.length > 0 ? (
            filteredAndSortedPosts.map((post) => (
              <CategoryItem
                key={post.id}
                post={post}
                onDelete={handleDeletePost}
                onVote={handleVotePost}
              />
            ))
          ) : (
            <div className='flex justify-center mx-40'>
              <h3 className='text-xl font-semibold text-muted-foreground dark:text-gray-400 text-center mt-4'>
                {t('common.no-posts')}
              </h3>
            </div>
          )}
        </div>
        <div ref={addPostBtnContainerRef}>
          <div className='mt-8 text-center'>
            <Button asChild className='add-post-btn w-34 text-sm'>
              <Link to='/addpost'>
                <PlusCircle className='h-5 w-5 mr-2' />
                <span className='font-semibold'>{t('common.add-post')}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
