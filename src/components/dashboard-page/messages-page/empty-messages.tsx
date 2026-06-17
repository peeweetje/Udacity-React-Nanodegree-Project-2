import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyMessagesProps {
  innerRef?: React.RefObject<HTMLDivElement | null>;
}

const EmptyMessages = ({ innerRef }: EmptyMessagesProps) => {
  const { t } = useTranslation();

  return (
    <div ref={innerRef as React.RefObject<HTMLDivElement>} className='messages-empty-state opacity-0 text-center py-20'>
      <MessageSquare className='h-16 w-16 text-gray-300 mx-auto mb-4' />
      <p className='text-gray-500 text-lg'>
        {t('dashboard.noMessages')}
      </p>
      <p className='text-gray-400 text-sm mt-2'>
        {t('dashboard.noMessagesHint')}
      </p>
    </div>
  );
};

export default EmptyMessages;