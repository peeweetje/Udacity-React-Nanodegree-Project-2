import React from 'react';
import { Link } from 'react-router-dom';
import { User, Clock, LucideIcon } from 'lucide-react';
import FormattedDate from '../../forms/formatted-date';

interface NotificationCardData {
  id: string;
  type: 'comment' | 'post';
  label: string;
  author: string;
  postTitle: string;
  category: string;
  timestamp: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

interface NotificationCardProps {
  notification: NotificationCardData;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const Icon = notification.icon;

  return (
    <Link
      to={`/${notification.category}/${notification.id}`}
      className='notification-card opacity-0 block bg-card dark:bg-gray-800 rounded-xl shadow-sm border border-teal-500 dark:border-gray-700 p-4 md:p-5 hover:shadow-md hover:border-teal-400 dark:hover:border-teal-600 transition-all duration-200'
    >
      <div className='flex items-start space-x-3 md:space-x-4'>
        <div className={`${notification.iconBg} p-2 md:p-3 rounded-full flex-shrink-0`}>
          <Icon className={`h-4 w-4 md:h-5 md:w-5 ${notification.iconColor}`} />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm text-gray-900 dark:text-white font-medium truncate'>
            {notification.label}
          </p>
          <p className='text-sm text-gray-600 dark:text-gray-300 mt-1 truncate'>
            {notification.postTitle}
          </p>
          <div className='flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-400 dark:text-gray-500'>
            <span className='flex items-center space-x-1'>
              <User className='h-3 w-3' />
              <span>{notification.author}</span>
            </span>
            <span className='flex items-center space-x-1'>
              <Clock className='h-3 w-3' />
              <FormattedDate timestamp={notification.timestamp} />
            </span>
            <span>{notification.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NotificationCard;