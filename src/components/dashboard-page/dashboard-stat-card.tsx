import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

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
    <div
      data-dashboard-stat-card
      className='bg-card dark:bg-gray-800 rounded-xl shadow-sm border border-teal-500 dark:border-gray-700 p-6 flex items-center space-x-4'
    >
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
            {trendDirection === 'up' ? <TrendingUp className='h-3 w-3 inline-block mr-0.5' /> : <TrendingDown className='h-3 w-3 inline-block mr-0.5' />}
            {trend}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardStatCard;