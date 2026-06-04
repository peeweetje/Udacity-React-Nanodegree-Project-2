import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  useParams } from 'react-router-dom';
import CategoryCard from './category-card';
import AddPostButton from './add-post-button';
import CategoryItem from '../category-item/catergory-item';
import CategoryMenu from '../category-menu/category-menu';
import MobileSidebar from '../dashboard-page/mobile-sidebar';
import HamburgerButton from '@/components/ui/hamburger-button';
import Header from '@/components/header/header';
import { sortPosts } from '../../utils/sortPosts';
import * as actions from '../../redux/actions';
import { useTranslation } from 'react-i18next';
import { Post } from '../../types/post';
import { VoteOption } from '../../utils/api';
import { animateCards } from '../animations/card-animations';
import { useGsapContext } from '../animations/use-gsap-animation';

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

  // CategoryItem now handles its own card entrance and hover animations internally.
  // No need to animate .category-post-card from here to avoid double-animation.

  const filteredAndSortedPosts: Post[] =
    posts && posts.length > 0
      ? sortPosts(
          posts.filter((post) => !post.deleted && !post.error),
          sort.value
        )
      : [];

  useGsapContext(listContainerRef as React.RefObject<HTMLDivElement | null>, () => {
    animateCards('.no-posts-message', animationsEnabled, 0.2, 0.3);
  }, [animationsEnabled, filteredAndSortedPosts.length]);
  // Animates the "no posts in this category" empty state message when there are no posts.
  // Re-triggers when filteredAndSortedPosts.length changes (i.e. when posts appear/disappear).

  useGsapContext(categoryCardContainerRef as React.RefObject<HTMLDivElement | null>, () => {
    animateCards('.formatted-category-card', animationsEnabled, 0.2, 0.3);
  }, [animationsEnabled]);
  // Note: Only depends on animationsEnabled, not posts, so voting doesn't re-trigger the animation.

  useGsapContext(addPostBtnContainerRef as React.RefObject<HTMLDivElement | null>, () => {
    animateCards('.add-post-btn', animationsEnabled, 0.2, 0.5);
  }, [animationsEnabled]);
  // Animates the add post button on mount.

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
            <Header />
          </div>
          <div className='mt-4 mb-6 flex justify-center'>
            <CategoryMenu />
          </div>
          <CategoryCard ref={categoryCardContainerRef} categoryName={categoryName || ''} />
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
            <div className='no-posts-message flex justify-center mx-40'>
              <h3 className='text-xl font-semibold text-muted-foreground dark:text-gray-400 text-center mt-4'>
                {t('common.no-posts')}
              </h3>
            </div>
          )}
        </div>
        <AddPostButton ref={addPostBtnContainerRef} />
      </div>
    </div>
  );
};

export default Categories;