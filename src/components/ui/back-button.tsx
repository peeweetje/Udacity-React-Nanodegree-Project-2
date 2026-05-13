import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ className, children }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={() => navigate(-1)}
      className={`${className}`}
    >
      <ArrowLeft className='h-4 w-4 md:mr-2' />
      <span className='hidden md:inline'>{children || 'Back'}</span>
    </Button>
  );
};

export default BackButton;