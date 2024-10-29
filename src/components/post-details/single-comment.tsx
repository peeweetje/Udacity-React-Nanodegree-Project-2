import React from 'react';
import { Link } from 'react-router-dom';
import Timestamp from 'react-timestamp';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Trash2, Edit, Clock, User } from 'lucide-react';

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

const SingleComment: React.FC<SingleCommentProps> = ({
  comment,
  onUpvote,
  onDownvote,
  onDelete,
}) => {
  const { id, author, body, voteScore, timestamp } = comment;
  const { t } = useTranslation();

  return (
    <div className=' flex flex-col w-full md:w-3/4 mx-auto mt-8 px-4'>
      <Card className='mb-4 flex flex-col'>
        <CardContent className='p-4 flex flex-col h-full'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-2'>
            <div className='flex items-center space-x-2 mb-2 sm:mb-0'>
              <User className='w-5 h-5 text-primary' />
              <span className='font-medium'>{author}</span>
            </div>
            <div className='flex items-center text-sm text-gray-500'>
              <Clock className='w-4 h-4 mr-1 text-primary' />
              <Timestamp
                date={timestamp ? timestamp / 1000 : undefined}
                options={{ twentyFourHour: true }}
              />
            </div>
          </div>
          <p className='my-4 flex-grow line-clamp-3'>{body}</p>
          <div className='flex flex-col sm:flex-row md:items-center md:justify-between space-y-2 md:space-y-0'>
            <div className='flex items-center space-x-2'>
              <Button className='w-18' size='sm' onClick={() => onUpvote(id)}>
                <ThumbsUp className='w-4 h-4 mr-1 text-primary' />
              </Button>
              <span className='font-medium'>{voteScore}</span>
              <Button
                className='w-18'
                variant='destructive'
                size='sm'
                onClick={() => onDownvote(id)}
              >
                <ThumbsDown className='w-4 h-4 mr-1 text-destructive' />
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
