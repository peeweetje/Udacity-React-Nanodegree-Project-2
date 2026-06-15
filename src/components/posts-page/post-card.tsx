import React from 'react';
import { Link } from 'react-router-dom';
import Timestamp from 'react-timestamp';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Trash2,
  Edit,
  User,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Post } from '../../types/post';
import VoteActions from '../shared/vote-actions';

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
  onVote: (postId: string, option: 'upVote' | 'downVote') => void;
  animationsEnabled: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onVote, animationsEnabled }) => {
  const { t } = useTranslation();

  return (
    <Card className='post-card w-full dark:bg-gray-800 dark:border-gray-700' key={post.id}>
      <CardHeader>
        <CardTitle>
          <Link
            to={`/${post.category}/${post.id}`}
            className='hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-200 dark:text-white'
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className='dark:text-gray-400'>
          <div className='flex flex-col space-y-1'>
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
            <p data-category-text className='text-xs font-medium text-teal-600 dark:text-teal-400'>
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col space-y-4'>
          <VoteActions
            id={post.id}
            voteScore={post.voteScore}
            onUpvote={(id) => onVote(id, 'upVote')}
            onDownvote={(id) => onVote(id, 'downVote')}
            animationsEnabled={animationsEnabled}
          />
          <div className='flex items-center dark:text-neutral-300'>
            <MessageSquare className='h-4 w-4 mr-2' />
            <span>{post.comments && post.comments.length}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end space-x-2'>
        <Button asChild size='sm' className='w-25'>
          <Link to={`/editpost/${post.id}`}>
            <Edit className='h-4 w-4 mr-2' />
            <span>{t('common.edit-post')}</span>
          </Link>
        </Button>
        <Button
          className='w-25'
          variant='destructive'
          size='sm'
          onClick={() => onDelete(post.id)}
        >
          <Trash2 className='h-4 w-4 mr-2 ' />
          <span>{t('common.delete-post')}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;