import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Languages, Settings } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { fetchPosts, fetchCategories } from '../../redux/actions';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from './dashboard-sidebar';
import BackButton from '@/components/ui/back-button';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<any>();
  const location = useLocation();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchCategories());
  }, [dispatch, location.pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className='flex min-h-screen bg-gray-50 dark:bg-gray-900'>
      <DashboardSidebar />
      <div className='flex-1 flex flex-col'>
        <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pl-16 md:pl-8 pr-4 py-4 flex items-center justify-between'>
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
          <div className='max-w-2xl mx-auto space-y-6 md:space-y-8'>
            {/* Language Section */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6'>
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

            {/* Theme Section */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6'>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;