import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import Timestamp from 'react-timestamp';
import { Link } from 'react-router-dom';
import {
  ThumbsUp,
  ThumbsDown,
  User,
  Clock,
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
import { animateVoteButton } from '../animations/vote-animations';
import { animateCards } from '../animations/card-animations';
import { animateCategoryText } from '../animations/text-animations';
import { useGsapContext, useGsapCardHover } from '../animations/use-gsap-animation';
import { Post } from '../../types/post';

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

  const handleDelete = () => onDelete(post.id);
  const handleUpVote = (e: React.MouseEvent<HTMLButtonElement>) => {
    onVote(post.id, 'upVote');
    animateVoteButton(e.currentTarget, 'up');
  };
  const handleDownVote = (e: React.MouseEvent<HTMLButtonElement>) => {
    onVote(post.id, 'downVote');
    animateVoteButton(e.currentTarget, 'down');
  };

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
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <User className='h-4 w-4' />
              <span>{post.author}</span>
            </div>
            <div className='flex items-center space-x-2 mt-1'>
              <Clock className='h-4 w-4' />
              <Timestamp
                date={post.timestamp / 1000}
                options={{ twentyFourHour: true }}
              />
            </div>
          </div>
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
          <div className='flex items-center space-x-4'>
            <Button className='w-18' size='sm' onClick={handleUpVote}>
              <ThumbsUp className='h-4 w-4 mr-1' />
            </Button>
            <span className='text-sm font-medium dark:text-white'>{post.voteScore}</span>
            <Button
              className='w-18'
              variant='destructive'
              size='sm'
              onClick={handleDownVote}
            >
              <ThumbsDown className='h-4 w-4' />
            </Button>
          </div>
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
