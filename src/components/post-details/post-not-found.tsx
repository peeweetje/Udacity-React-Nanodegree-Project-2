import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import BackButton from '@/components/ui/back-button';

const PostNotFound = () => {
  const { t } = useTranslation();

  return (
    <Card className='mt-8 dark:bg-gray-800 dark:border-gray-700'>
      <CardContent className='text-center py-8'>
        <h3 className='text-xl font-semibold dark:text-white mb-4'>
          {t('postDetails.not-found')}
        </h3>
        <BackButton />
      </CardContent>
    </Card>
  );
};

export default PostNotFound;