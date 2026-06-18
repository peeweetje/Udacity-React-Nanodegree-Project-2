import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

interface LanguageSettingsProps {
  languageCardRef?: RefObject<HTMLDivElement | null>;
}

const LanguageSettings = ({ languageCardRef }: LanguageSettingsProps) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div
      ref={languageCardRef as React.RefObject<HTMLDivElement>}
      className='settings-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6'
    >
      <div className='flex items-center space-x-3 mb-6'>
        <Languages className='h-6 w-6 text-teal-500' />
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
          {t('dashboard.language')}
        </h2>
      </div>
      <div className='flex space-x-4'>
        <button
          onClick={() => changeLanguage('en')}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
            i18n.language === 'en'
              ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-teal-300'
          }`}
        >
          🇬🇧 {t('dashboard.english')}
        </button>
        <button
          onClick={() => changeLanguage('nl')}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
            i18n.language === 'nl'
              ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-teal-300'
          }`}
        >
          🇳🇱 {t('dashboard.dutch')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSettings;