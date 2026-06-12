import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { animateCards } from '../animations/card-animations';
import { animateCategoryText } from '../animations/text-animations';
import { useGsapContext, useGsapCardHover } from '../animations/use-gsap-animation';
import { Post } from '../../types/post';
import CategoryItemCard from './category-item-card';

interface CategoryItemProps {
  post: Post;
  onDelete: (id: string) => void;
  onVote: (id: string, option: 'upVote' | 'downVote') => void;
}

const CategoryItem = ({ post, onDelete, onVote }: CategoryItemProps) => {
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const cardRef = useRef<HTMLDivElement>(null);

  useGsapContext(
    cardRef as React.RefObject<HTMLDivElement | null>,
    () => {
      animateCards('[data-category-card]', animationsEnabled, 0.15, 0.1);
      if (cardRef.current) {
        animateCategoryText(cardRef.current, '[data-category-name]', animationsEnabled, 0.6);
      }
    },
    [animationsEnabled]
  );

  useGsapCardHover(
    cardRef as React.RefObject<HTMLDivElement | null>,
    '[data-category-card]',
    animationsEnabled
  );

  return (
    <div ref={cardRef}>
      <CategoryItemCard
        post={post}
        onDelete={onDelete}
        onVote={onVote}
        animationsEnabled={animationsEnabled}
      />
    </div>
  );
};

export default CategoryItem;