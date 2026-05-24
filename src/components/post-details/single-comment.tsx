import React from 'react';
import { Link } from 'react-router-dom';
import Timestamp from 'react-timestamp';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Trash2, Edit, Clock, User } from 'lucide-react';
import { animateVoteButton } from '../animations/vote-animations';

interface Comment {
  id: string;
  author: string;
  body: string;
  voteScore: number;
  timestamp: number;
}

interface SingleCommentProps {
  comment: Comment;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onDelete: (id: string) => void;
}

const SingleComment = ({ comment, onUpvote, onDownvote, onDelete }: SingleCommentProps) => {
  const { id, author, body, voteScore, timestamp } = comment;
  const { t } = useTranslation();
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);

  return (
    <div data-post-detail-card className=' flex flex-col w-full md:w-3/4 mx-auto mt-8 px-4'>
      <Card className='mb-4 flex flex-col dark:bg-gray-800 dark:border-gray-700'>
        <CardContent className='p-4 flex flex-col h-full'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-2'>
            <div className='flex items-center space-x-2 mb-2 sm:mb-0'>
              <User className='w-5 h-5 text-primary dark:text-teal-400' />
              <span className='font-medium dark:text-white'>{author}</span>
            </div>
            <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
              <Clock className='w-4 h-4 mr-1 text-primary' />
              <Timestamp
                date={timestamp / 1000}
                options={{ twentyFourHour: true }}
              />
            </div>
          </div>
          <p className='my-4 grow line-clamp-3 dark:text-gray-300'>{body}</p>
          <div className='flex flex-col sm:flex-row md:items-center md:justify-between space-y-2 md:space-y-0'>
            <div className='flex items-center space-x-2'>
              <Button className='w-18' size='sm' onClick={(e) => { onUpvote(id); animateVoteButton(e.currentTarget, 'up', animationsEnabled); }}>
                <ThumbsUp className='w-4 h-4 mr-1 text-primary dark:text-white' />
              </Button>
              <span className='font-medium dark:text-white'>{voteScore}</span>
              <Button
                className='w-18'
                variant='destructive'
                size='sm'
                onClick={(e) => { onDownvote(id); animateVoteButton(e.currentTarget, 'down', animationsEnabled); }}
              >
                <ThumbsDown className='w-4 h-4 mr-1 text-destructive dark:text-white' />
              </Button>
            </div>
            <div className='flex flex-row space-x-2 sm:m-1'>
              <Link to={`/editcomment/${id}`}>
                <Button className='w-34' size='sm'>
                  <Edit className='w-4 h-4 mr-2' />
                  <span className='hidden lg:inline p-1'>
                    {t('singleComment.edit-comment')}
                  </span>
                  <span className='lg:hidden'> {t('singleComment.edit')}</span>
                </Button>
              </Link>
              <Button
                className='w-34'
                variant='destructive'
                size='sm'
                onClick={() => onDelete(id)}
              >
                <Trash2 className='w-4 h-4 mr-2' />
                <span className='hidden lg:inline '>
                  {t('singleComment.delete-comment')}
                </span>
                <span className='lg:hidden'> {t('singleComment.delete')}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleComment;
