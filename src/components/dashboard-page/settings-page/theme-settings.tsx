import React, { RefObject, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon } from 'lucide-react';
import SettingsCard from '@/components/dashboard-page/settings-page/settings-components/settings-card';
import SettingsCardHeader from '@/components/dashboard-page/settings-page/settings-components/settings-card-header';
import SettingsOptionButton from '@/components/dashboard-page/settings-page/settings-components/settings-option-button';

interface ThemeSettingsProps {
  themeCardRef?: RefObject<HTMLDivElement | null>;
}

const ThemeSettings = ({ themeCardRef }: ThemeSettingsProps) => {
  const { t } = useTranslation();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const themeIcon = theme === 'light' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />;

  return (
    <SettingsCard ref={themeCardRef as React.RefObject<HTMLDivElement>}>
      <SettingsCardHeader icon={themeIcon} title={t('dashboard.theme')} />
      <div className='flex space-x-4'>
        <SettingsOptionButton
          selected={theme === 'light'}
          onClick={() => setTheme('light')}
          icon={<Sun className='h-4 w-4' />}
        >
          {t('dashboard.light')}
        </SettingsOptionButton>
        <SettingsOptionButton
          selected={theme === 'dark'}
          onClick={() => setTheme('dark')}
          icon={<Moon className='h-4 w-4' />}
        >
          {t('dashboard.dark')}
        </SettingsOptionButton>
      </div>
    </SettingsCard>
  );
};

export default ThemeSettings;
