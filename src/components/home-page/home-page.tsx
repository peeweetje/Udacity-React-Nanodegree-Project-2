import React, { useRef, useEffect } from 'react';
import {
  MessageSquare,
  PlusCircle,
  List,
  LayoutDashboard,
} from 'lucide-react';
import HomePageButton from './home-page-button';
import HomePageCard from './home-page-card';
import { useTranslation } from 'react-i18next';
import {
  animateArrow,
  animateTitle,
  animatePlusIcon,
  animateOrbs,
  animateCards,
} from './animations';

const HomePage = () => {
  const { t } = useTranslation();
  const arrowRef = useRef<SVGSVGElement>(null);
  const dashboardArrowRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const plusIconRef = useRef<SVGSVGElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animateArrow(arrowRef);
    animateArrow(dashboardArrowRef);
    animateTitle(titleRef);
    animatePlusIcon(plusIconRef);
    animateOrbs(bgRef);
    animateCards(cardsRef);
  }, []);

  return (
    <div className='relative flex min-h-screen bg-background dark:bg-gray-900 items-center justify-center overflow-hidden'>
      <div
        ref={bgRef}
        className='absolute inset-0 pointer-events-none'
        aria-hidden='true'
      >
        <div className='absolute w-[500px] h-[500px] rounded-full bg-purple-600/40 blur-[120px]' style={{ left: '-100px', top: '-100px' }} />
        <div className='absolute w-[400px] h-[400px] rounded-full bg-teal-500/40 blur-[120px]' style={{ left: 'calc(100vw - 400px)', bottom: '-80px' }} />
        <div className='absolute w-[300px] h-[300px] rounded-full bg-fuchsia-500/20 blur-[120px]' style={{ left: 'calc(50% - 150px)', top: 'calc(50% - 150px)' }} />
      </div>
      <div className='relative container mx-auto px-4 text-center'>
        <div className='mb-8'>
          <h1 ref={titleRef} className='text-5xl font-bold text-primary dark:text-white mb-4'>{t('common.git-talks')}</h1>
          <p className='text-xl text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto'>
            {t('common.welcome-message')}
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-8'>
          <HomePageButton
            to='/posts'
            icon={List}
            label={t('common.view-posts')}
            showArrow
            arrowRef={arrowRef}
          />

          <HomePageButton
            to='/addpost'
            icon={PlusCircle}
            label={t('common.create-post')}
            variant='outline'
            iconRef={plusIconRef}
          />

          <HomePageButton
            to='/home'
            icon={LayoutDashboard}
            label={t('common.dashboard')}
            showArrow
            arrowRef={dashboardArrowRef}
          />
        </div>

        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
          <HomePageCard
            icon={MessageSquare}
            title={t('common.discuss')}
            description={t('common.discuss-desc')}
            cardRef={(el) => { if (el) cardsRef.current[0] = el; }}
          />
          <HomePageCard
            icon={List}
            title={t('common.browse')}
            description={t('common.browse-desc')}
            cardRef={(el) => { if (el) cardsRef.current[1] = el; }}
          />
          <HomePageCard
            icon={PlusCircle}
            title={t('common.share')}
            description={t('common.share-desc')}
            cardRef={(el) => { if (el) cardsRef.current[2] = el; }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;