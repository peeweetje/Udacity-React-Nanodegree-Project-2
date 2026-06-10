import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { animateCardHover } from '../animations/card-animations';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import VoteActions from '../shared/vote-actions';
import AuthorTimestamp from '../shared/author-timestamp';
import EditDeleteActions from '../shared/edit-delete-actions';

interface Post {
  id: string;
  title: string;
  author: string;
  timestamp: number;
  body: string;
  voteScore: number;
}

interface SinglePostProps {
  post: Post;
  commentsCount: number;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onDelete: (id: string) => void;
}

const SinglePost = ({
  post,
  commentsCount,
  onUpvote,
  onDownvote,
  onDelete,
}: SinglePostProps) => {
  const { id, title, author, timestamp, body, voteScore } = post;
  const { t } = useTranslation();
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animationsEnabled || !cardRef.current) return;
    const cleanup = animateCardHover(cardRef.current);
    return () => cleanup();
  }, [animationsEnabled]);

  return (
    <div data-post-detail-card className='flex flex-col mx-auto w-full px-4'>
      <Card ref={cardRef} className='post-detail-card flex flex-col w-full mx-auto overflow-hidden dark:bg-gray-800 dark:border-gray-700'>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-xl sm:text-2xl break-words dark:text-white'>
            {title}
          </CardTitle>
          <div className='flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground dark:text-gray-400'>
            <AuthorTimestamp author={author} timestamp={timestamp} showClock={false} />
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm sm:text-base break-words dark:text-gray-300'>{body}</p>
        </CardContent>
        <CardFooter className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div className='flex items-center space-x-2 flex-wrap'>
            <VoteActions
              id={id}
              voteScore={voteScore}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
              animationsEnabled={animationsEnabled}
            />
            <Button variant='ghost' size='sm' className='ml-2'>
              <MessageCircle className='w-4 h-4 mr-1 dark:text-neutral-300' />
              <span className='text-sm sm:text-base dark:text-neutral-300'>{commentsCount}</span>
            </Button>
          </div>
          <EditDeleteActions
            editLink={`/editpost/${id}`}
            onDelete={() => onDelete(id)}
            editLabelFull={t('singlePost.edit-post')}
            editLabelShort={t('singlePost.edit')}
            deleteLabelFull={t('singlePost.delete-post')}
            deleteLabelShort={t('singlePost.delete')}
            containerClassName='flex space-x-2 w-full sm:w-auto'
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default SinglePost;