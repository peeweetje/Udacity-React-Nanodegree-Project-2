import * as React from 'react';
import { cn } from '@/lib/utils';

interface SettingsCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const SettingsCard = React.forwardRef<HTMLDivElement, SettingsCardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'settings-card bg-card dark:bg-gray-800 rounded-xl shadow-sm border border-purple-500 dark:border-gray-700 p-4 md:p-6',
        className
      )}
      {...props}
    />
  )
);

export default SettingsCard;
