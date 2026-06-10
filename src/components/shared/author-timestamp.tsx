import React from 'react';
import Timestamp from 'react-timestamp';
import { User, Clock } from 'lucide-react';

interface AuthorTimestampProps {
  author: string;
  timestamp: number;
  showClock?: boolean;
}

const AuthorTimestamp = ({ author, timestamp, showClock = true }: AuthorTimestampProps) => {
  return (
    <div className='flex items-center space-x-2'>
      <User className='w-5 h-5 text-primary dark:text-teal-400' />
      <span className='font-medium dark:text-white'>{author}</span>
      {showClock && (
        <div className='flex items-center space-x-1'>
          <Clock className='w-4 h-4 text-primary dark:text-gray-400' />
          <Timestamp
            date={timestamp / 1000}
            options={{ twentyFourHour: true }}
          />
        </div>
      )}
      {!showClock && (
        <Timestamp
          date={timestamp / 1000}
          options={{ twentyFourHour: true }}
        />
      )}
    </div>
  );
};

export default AuthorTimestamp;