import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface DashboardSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const DashboardSearch = ({ value, onChange }: DashboardSearchProps) => {
  const { t } = useTranslation();

  return (
    <div className='relative w-full md:w-96'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
      <Input
        className='pl-10 bg-card dark:bg-gray-700 border-teal-500 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
        placeholder={t('dashboard.search-placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default DashboardSearch;