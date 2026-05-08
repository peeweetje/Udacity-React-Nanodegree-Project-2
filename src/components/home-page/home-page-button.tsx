import React, { RefObject } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface HomePageButtonProps {
  to: string;
  icon: LucideIcon;
  label: string;
  variant?: 'default' | 'outline';
  iconRef?: RefObject<SVGSVGElement | null>;
  showArrow?: boolean;
  arrowRef?: RefObject<SVGSVGElement | null>;
}

const HomePageButton = ({
  to,
  icon: Icon,
  label,
  variant = 'default',
  iconRef,
  showArrow = false,
  arrowRef,
}: HomePageButtonProps) => {
  return (
    <Button asChild size='lg' variant={variant} className='w-56 text-base'>
      <Link to={to}>
        <Icon ref={iconRef} className='h-5 w-5 mr-2' />
        {label}
        {showArrow && <ArrowRight ref={arrowRef} className='h-5 w-5 ml-2' />}
      </Link>
    </Button>
  );
};

export default HomePageButton;
