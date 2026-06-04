import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const AddPostButton = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();

  return (
    <div ref={ref}>
      <div className='mt-8 text-center'>
        <Button asChild className='add-post-btn w-34 text-sm'>
          <Link to='/addpost'>
            <PlusCircle className='h-5 w-5 mr-2' />
            <span className='font-semibold'>{t('common.add-post')}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
});

AddPostButton.displayName = 'AddPostButton';

export default AddPostButton;