import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HamburgerButtonProps {
  onClick: () => void;
  className?: string;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ onClick, className = '' }) => {
  const { t } = useTranslation();

  return (
    <div className={`md:hidden fixed top-4 left-4 z-50 ${className}`}>
      <Button
        variant='outline'
        size='icon'
        onClick={onClick}
      >
        <MenuIcon className='h-5 w-5' />
        <span className='sr-only'>{t('common.toggle-menu')}</span>
      </Button>
    </div>
  );
};

export default HamburgerButton;