import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Comment } from '../../../utils/api';
import FormattedDate from '../../forms/formatted-date';

interface MessageCardProps {
  comment: Comment;
  postTitle: string;
  postCategory: string;
  postId: string;
}

const MessageCard = ({ comment, postTitle, postCategory, postId }: MessageCardProps) => {
  const { t } = useTranslation();
  return (
    <Link
      to={`/${postCategory}/${postId}`}
      className='message-card opacity-0 block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-5 hover:shadow-md hover:border-teal-200 dark:hover:border-teal-600 transition-all duration-200'
    >
      <div className='flex items-start space-x-3 md:space-x-4'>
        <div className='bg-teal-50 p-2 md:p-3 rounded-full flex-shrink-0'>
          <MessageSquare className='h-4 w-4 md:h-5 md:w-5 text-teal-600' />
        </div>
        <div className='flex-1 min-w-0'>
          <div className='text-sm'>
            <span className='font-medium text-gray-900 dark:text-white'>{comment.author}</span>
            <span className='text-gray-400 mx-1'>{t('dashboard.commentedOn')}</span>
            <span className='font-medium text-teal-600'>{postTitle}</span>
          </div>
          <p className='text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2'>
            {comment.body}
          </p>
          <div className='flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-400 dark:text-gray-500'>
            <span className='flex items-center space-x-1'>
              <Clock className='h-3 w-3' />
              <FormattedDate timestamp={comment.timestamp} />
            </span>
            <span>{postCategory}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MessageCard;