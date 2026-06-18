import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAnimations } from '../../../redux/actions';
import { Zap } from 'lucide-react';

interface AnimationSettingsProps {
  animationsCardRef?: RefObject<HTMLDivElement | null>;
}

const AnimationSettings = ({ animationsCardRef }: AnimationSettingsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);

  const handleAnimationsToggle = () => {
    dispatch(toggleAnimations(!animationsEnabled));
  };

  return (
    <div
      ref={animationsCardRef as React.RefObject<HTMLDivElement>}
      className='settings-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6'
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <Zap className='h-6 w-6 text-teal-500' />
          <div>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
              {t('dashboard.animations') || 'Animations'}
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {t('dashboard.animations-description') || 'Enable or disable interface animations'}
            </p>
          </div>
        </div>
        <button
          onClick={handleAnimationsToggle}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
            animationsEnabled
              ? 'bg-teal-500 dark:bg-teal-600'
              : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
              animationsEnabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default AnimationSettings;