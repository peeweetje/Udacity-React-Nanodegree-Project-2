import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { animateCards } from '../animations/card-animations';
import { useGsapContext, useGsapCardHover } from '../animations/use-gsap-animation';
import VoteActions from '../shared/vote-actions';
import AuthorTimestamp from '../shared/author-timestamp';
import EditDeleteActions from '../shared/edit-delete-actions';

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
  const cardRef = useRef<HTMLDivElement>(null);

  useGsapContext(
    cardRef as React.RefObject<HTMLDivElement | null>,
    () => {
      animateCards('[data-comment-card]', animationsEnabled, 0.15, 0.1);
    },
    [animationsEnabled]
  );

  useGsapCardHover(
    cardRef as React.RefObject<HTMLDivElement | null>,
    '[data-comment-card]',
    animationsEnabled
  );

  return (
    <div ref={cardRef} data-post-detail-card className='flex flex-col w-full md:w-3/4 mx-auto mt-8 px-4'>
      <Card data-comment-card className='comment-card mb-4 flex flex-col dark:bg-gray-800 dark:border-gray-700'>
        <CardContent className='p-4 flex flex-col h-full'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-2'>
            <AuthorTimestamp author={author} timestamp={timestamp} />
          </div>
          <p className='my-4 grow line-clamp-3 dark:text-gray-300'>{body}</p>
          <div className='flex flex-col sm:flex-row md:items-center md:justify-between space-y-2 md:space-y-0'>
            <VoteActions
              id={id}
              voteScore={voteScore}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
              animationsEnabled={animationsEnabled}
            />
            <EditDeleteActions
              editLink={`/editcomment/${id}`}
              onDelete={() => onDelete(id)}
              editLabelFull={t('singleComment.edit-comment')}
              editLabelShort={t('singleComment.edit')}
              deleteLabelFull={t('singleComment.delete-comment')}
              deleteLabelShort={t('singleComment.delete')}
              containerClassName='flex flex-row space-x-2 sm:m-1'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleComment;