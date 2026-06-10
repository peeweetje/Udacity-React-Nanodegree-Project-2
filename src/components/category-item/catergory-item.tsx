import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Trash,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { animateCards } from '../animations/card-animations';
import { animateCategoryText } from '../animations/text-animations';
import { useGsapContext, useGsapCardHover } from '../animations/use-gsap-animation';
import { Post } from '../../types/post';
import VoteActions from '../shared/vote-actions';
import AuthorTimestamp from '../shared/author-timestamp';

interface CategoryItemProps {
  post: Post;
  onDelete: (id: string) => void;
  onVote: (id: string, option: 'upVote' | 'downVote') => void;
}

const CategoryItem = ({ post, onDelete, onVote }: CategoryItemProps) => {
  const { t } = useTranslation();
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

  const handleUpvote = (id: string) => onVote(id, 'upVote');
  const handleDownvote = (id: string) => onVote(id, 'downVote');
  const handleDelete = () => onDelete(post.id);

  return (
    <div ref={cardRef}>
    <Card data-category-card className='category-post-card w-4/5 mx-auto mb-4 dark:bg-gray-800 dark:border-gray-700'>
      <CardHeader>
        <CardTitle>
          <Link
            to={`/${post.category}/${post.id}`}
            className='hover:text-teal-500 dark:hover:text-teal-400 dark:text-white'
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className='dark:text-gray-400'>
          <AuthorTimestamp author={post.author} timestamp={post.timestamp} />
          <p
            data-category-name
            className='text-xs font-medium text-teal-600 dark:text-teal-400 mt-2'
          >
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className='text-md mb-6 dark:text-gray-300'>{post.body}</p>
        <div className='flex flex-col space-y-2'>
          <VoteActions
            id={post.id}
            voteScore={post.voteScore}
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
            animationsEnabled={animationsEnabled}
          />
          <div className='flex items-center text-md text-muted-foreground dark:text-gray-400'>
            <MessageSquare className='h-5 w-5 mr-1' />
            <span>{post.comments ? post.comments.length : 0} comments</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end space-x-2'>
        <Link to={`/editpost/${post.id}`}>
          <Button className='w-32'>
            <Edit className='h-4 w-4 mr-1' />
            {t('categoryItem.edit')}
          </Button>
        </Link>
        <Button className='w-32' variant='destructive' onClick={handleDelete}>
          <Trash className='h-4 w-4 mr-1' />
          {t('categoryItem.delete')}
        </Button>
      </CardFooter>
    </Card>
    </div>
  );
};

export default CategoryItem;