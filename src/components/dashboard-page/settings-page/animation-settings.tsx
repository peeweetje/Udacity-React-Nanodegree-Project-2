import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAnimations } from '../../../redux/actions';
import { Zap } from 'lucide-react';
import SettingsCard from '@/components/dashboard-page/settings-page/settings-components/settings-card';
import SettingsCardHeader from '@/components/dashboard-page/settings-page/settings-components/settings-card-header';

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
    <SettingsCard ref={animationsCardRef as React.RefObject<HTMLDivElement>}>
      <div className='flex items-center justify-between'>
        <SettingsCardHeader
          icon={<Zap className="h-6 w-6" />}
          title={t('dashboard.animations') || 'Animations'}
          description={t('dashboard.animations-description')}
        />
        <button
          onClick={handleAnimationsToggle}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
            animationsEnabled
              ? 'bg-purple-500 dark:bg-purple-600'
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
    </SettingsCard>
  );
};

export default AnimationSettings;
