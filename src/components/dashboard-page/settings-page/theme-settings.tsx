import React, { RefObject, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon } from 'lucide-react';

interface ThemeSettingsProps {
  themeCardRef?: RefObject<HTMLDivElement | null>;
}

const ThemeSettings = ({ themeCardRef }: ThemeSettingsProps) => {
  const { t } = useTranslation();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div
      ref={themeCardRef as React.RefObject<HTMLDivElement>}
      className='settings-card bg-card dark:bg-gray-800 rounded-xl shadow-sm border border-teal-500 dark:border-gray-700 p-4 md:p-6'
    >
      <div className='flex items-center space-x-3 mb-6'>
        {theme === 'light' ? (
          <Sun className='h-6 w-6 text-teal-500' />
        ) : (
          <Moon className='h-6 w-6 text-teal-500' />
        )}
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
          {t('dashboard.theme')}
        </h2>
      </div>
      <div className='flex space-x-4'>
        <button
          onClick={() => setTheme('light')}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all flex items-center justify-center space-x-2 ${
            theme === 'light'
              ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-teal-300'
          }`}
        >
          <Sun className='h-4 w-4' />
          <span>{t('dashboard.light')}</span>
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all flex items-center justify-center space-x-2 ${
            theme === 'dark'
              ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-teal-300'
          }`}
        >
          <Moon className='h-4 w-4' />
          <span>{t('dashboard.dark')}</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;