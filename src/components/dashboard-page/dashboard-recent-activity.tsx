import React from 'react';
import { useTranslation } from 'react-i18next';

interface Activity {
  topic: string;
  category: string;
  date: string;
  status: 'active' | 'resolved';
}

interface DashboardRecentActivityProps {
  activities: Activity[];
}

const DashboardRecentActivity = ({ activities }: DashboardRecentActivityProps) => {
  const { t } = useTranslation();

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
        {t('dashboard.recent-activity')}
      </h3>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-gray-100 dark:border-gray-700'>
              <th className='text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400'>
                {t('dashboard.topic')}
              </th>
              <th className='text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400'>
                {t('common.category')}
              </th>
              <th className='text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400'>
                {t('dashboard.date')}
              </th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>
                {t('dashboard.status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr
                key={index}
                className='border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
              >
                <td className='py-3 px-4 font-medium text-gray-900 dark:text-white'>
                  {activity.topic}
                </td>
                <td className='py-3 px-4 text-gray-600 dark:text-gray-400'>{activity.category}</td>
                <td className='py-3 px-4 text-gray-600 dark:text-gray-400'>{activity.date}</td>
                <td className='py-3 px-4'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {activity.status === 'active'
                      ? t('dashboard.active')
                      : t('dashboard.resolved')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardRecentActivity;