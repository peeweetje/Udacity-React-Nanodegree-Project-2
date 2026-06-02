import React, { useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import gsap from 'gsap';

interface Activity {
  id: string;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  // Stable content key based on activitie IDs — prevents re-animation on voting or other
  // shallow array reference changes that don't actually add/remove/reorder rows.
  const contentKey = useMemo(() => activities.map(a => a.id).join(','), [activities]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const card = container.querySelector('[data-recent-activity-card]') as HTMLElement | null;
    const rows = container.querySelectorAll('[data-recent-activity-row]');
    const tableWrapper = container.querySelector('[data-recent-activity-table-wrapper]') as HTMLElement | null;

    if (!animationsEnabled) {
      // Show all rows immediately without animation
      if (card) gsap.set(card, { opacity: 1 });
      if (rows.length > 0) gsap.set(rows, { scale: 1, opacity: 1 });
      return;
    }

    // Synchronously set initial hidden state before paint to prevent flicker
    if (card) gsap.set(card, { opacity: 0 });
    if (rows.length > 0) gsap.set(rows, { scale: 0.85, opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: 'back.out(1.2)' },
      onStart: () => {
        if (tableWrapper) tableWrapper.style.overflow = 'hidden';
      },
      onComplete: () => {
        if (tableWrapper) tableWrapper.style.overflow = '';
      },
    });

    // Card container: subtle fade in
    if (card) {
      tl.fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    }

    // Table rows: pop-in with scale + fade
    if (rows.length > 0) {
      tl.fromTo(
        rows,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06 },
        '-=0.2'
      );
    }

    return () => {
      tl.kill();
    };
  }, [contentKey, animationsEnabled]);

  return (
    <div ref={containerRef}>
      <div
        data-recent-activity-card
        className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6'
      >
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
        {t('dashboard.recent-activity')}
      </h3>
      <div data-recent-activity-table-wrapper className='overflow-x-auto'>
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
                data-recent-activity-row
                className='border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
              >
                <td className='py-3 px-4 font-medium'>
                  <Link
                    to={`/${activity.category}/${activity.id}`}
                    className='text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors'
                  >
                    {activity.topic}
                  </Link>
                </td>
                <td className='py-3 px-4 text-gray-600 dark:text-gray-400'>{activity.category}</td>
                <td className='py-3 px-4 text-gray-600 dark:text-gray-400'>{activity.date}</td>
                <td className='py-3 px-4'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-teal-900/80 dark:text-teal-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-200'
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
    </div>
  );
};

export default DashboardRecentActivity;