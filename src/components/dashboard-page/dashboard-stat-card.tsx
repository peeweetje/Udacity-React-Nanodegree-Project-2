import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

const DashboardStatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendDirection = 'up',
}: DashboardStatCardProps) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center space-x-4'>
      <div className='bg-teal-50 dark:bg-teal-900/50 p-4 rounded-lg'>
        <Icon className='h-8 w-8 text-teal-500' />
      </div>
      <div className='flex-1'>
        <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>{label}</p>
        <p className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>{value}</p>
        {trend && (
          <p
            className={`text-xs mt-1 flex items-center ${
              trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trendDirection === 'up' ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardStatCard;