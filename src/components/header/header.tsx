import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/ui/back-button';

const Header = () => {
  const { t } = useTranslation();

  return (
    <div className='mt-4 flex flex-wrap items-center justify-center gap-2'>
      <BackButton />
      <Button asChild variant='outline' size='sm'>
        <Link to='/'>
          <Home className='h-4 w-4 sm:mr-2' />
          <span className='hidden sm:inline'>{t('common.home')}</span>
        </Link>
      </Button>
      <Button asChild variant='outline' size='sm'>
        <Link to='/home'>
          <LayoutDashboard className='h-4 w-4 sm:mr-2' />
          <span className='hidden sm:inline'>{t('common.dashboard')}</span>
        </Link>
      </Button>
    </div>
  );
};

export default Header;