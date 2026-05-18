import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { gsap } from 'gsap';

interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const BackButton = ({ className, children }: BackButtonProps) => {
  const navigate = useNavigate();
  const arrowRef = useRef<SVGSVGElement>(null);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);

  useEffect(() => {
    if (!arrowRef.current || !animationsEnabled) return;
    
    gsap.to(arrowRef.current, {
      x: 5,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    return () => {
      gsap.killTweensOf(arrowRef.current);
    };
  }, [animationsEnabled]);

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={() => navigate(-1)}
      className={`${className}`}
    >
      <ArrowLeft ref={arrowRef} className='h-4 w-4 md:mr-4' />
      <span className='hidden md:inline'>{children || 'Back'}</span>
    </Button>
  );
};

export default BackButton;