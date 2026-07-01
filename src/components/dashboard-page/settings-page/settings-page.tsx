import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';
import {  useSelector } from 'react-redux';

import DashboardSidebar from '../sidebar/dashboard-sidebar';
import BackButton from '@/components/ui/back-button';
import { animateCards } from '../../animations/card-animations';
import { useGsapContext, useGsapCardHover } from '../../animations/use-gsap-animation';
import LanguageSettings from './language-settings';
import ThemeSettings from './theme-settings';
import AnimationSettings from './animation-settings';

const SettingsPage = () => {
  const { t } = useTranslation();
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const languageCardRef = useRef<HTMLDivElement>(null);
  const themeCardRef = useRef<HTMLDivElement>(null);
  const animationsCardRef = useRef<HTMLDivElement>(null);

  useGsapContext(cardsContainerRef as React.RefObject<HTMLDivElement | null>, () => {
    animateCards('.settings-card', animationsEnabled);
  }, [animationsEnabled]);

  useGsapCardHover(
    cardsContainerRef as React.RefObject<HTMLDivElement | null>,
    '.settings-card',
    animationsEnabled
  );

  return (
    <div className='flex min-h-screen bg-white dark:bg-gray-900'>
      <DashboardSidebar />
      <div className='flex-1 flex flex-col'>
        <header className='bg-card dark:bg-gray-800 border-b border-teal-500 dark:border-gray-700 pl-16 md:pl-8 pr-4 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <BackButton />
            <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
              {t('dashboard.settings')}
            </h1>
          </div>
          <div className='bg-teal-100 p-2 rounded-full'>
            <Settings className='h-6 w-6 text-teal-600' />
          </div>
        </header>

        <main className='flex-1 p-4 md:p-8 overflow-y-auto'>
          <div ref={cardsContainerRef} className='max-w-2xl mx-auto space-y-6 md:space-y-8'>
            <LanguageSettings languageCardRef={languageCardRef} />
            <ThemeSettings themeCardRef={themeCardRef} />
            <AnimationSettings animationsCardRef={animationsCardRef} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;