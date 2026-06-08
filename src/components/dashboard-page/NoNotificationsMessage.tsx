import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';

interface NoNotificationsMessageProps {
  className?: string;
}

const NoNotificationsMessage = forwardRef<HTMLDivElement, NoNotificationsMessageProps>(
  ({ className = '' }, ref) => {
    const { t } = useTranslation();

    return (
      <div
        ref={ref}
        className={`notification-empty-state opacity-0 text-center py-20 ${className}`}
      >
        <Bell className='h-16 w-16 text-gray-300 mx-auto mb-4' />
        <p className='text-gray-500 text-lg'>
          {t('dashboard.no-notifications')}
        </p>
      </div>
    );
  }
);

NoNotificationsMessage.displayName = 'NoNotificationsMessage';

export default NoNotificationsMessage;