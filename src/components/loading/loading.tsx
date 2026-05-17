import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Loading = () => {
  const { t } = useTranslation();
  return (
    <div
      role='status'
      className='flex flex-col items-center justify-center h-screen font-sans dark:bg-gray-950'
    >
      <Loader2 className='w-14 h-14 text-teal-700 animate-spin dark:text-teal-400' />
      <span className='sr-only'>{t('common.loading')}</span>
    </div>
  );
};

export default Loading;