import React from 'react';
import { useTranslation } from 'react-i18next';

interface NoPostsMessageProps {
  className?: string;
}

const NoPostsMessage = ({ className = '' }: NoPostsMessageProps) => {
  const { t } = useTranslation();

  return (
    <div className={`no-posts-message flex justify-center mx-40 ${className}`}>
      <h3 className='text-xl font-semibold text-muted-foreground dark:text-gray-400 text-center mt-4'>
        {t('common.no-posts')}
      </h3>
    </div>
  );
};

export default NoPostsMessage;