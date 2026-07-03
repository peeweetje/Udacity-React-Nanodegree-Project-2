import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import SettingsCard from '@/components/dashboard-page/settings-page/settings-components/settings-card';
import SettingsCardHeader from '@/components/dashboard-page/settings-page/settings-components/settings-card-header';
import SettingsOptionButton from '@/components/dashboard-page/settings-page/settings-components/settings-option-button';

interface LanguageSettingsProps {
  languageCardRef?: RefObject<HTMLDivElement | null>;
}

const LanguageSettings = ({ languageCardRef }: LanguageSettingsProps) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <SettingsCard ref={languageCardRef as React.RefObject<HTMLDivElement>}>
      <SettingsCardHeader icon={<Languages className="h-6 w-6" />} title={t('dashboard.language')} />
      <div className='flex space-x-4'>
        <SettingsOptionButton
          selected={i18n.language === 'en'}
          onClick={() => changeLanguage('en')}
        >
          🇬🇧 {t('dashboard.english')}
        </SettingsOptionButton>
        <SettingsOptionButton
          selected={i18n.language === 'nl'}
          onClick={() => changeLanguage('nl')}
        >
          🇳🇱 {t('dashboard.dutch')}
        </SettingsOptionButton>
      </div>
    </SettingsCard>
  );
};

export default LanguageSettings;
