import * as React from 'react';
import { cn } from '@/lib/utils';

interface SettingsCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

const SettingsCardHeader = React.forwardRef<HTMLDivElement, SettingsCardHeaderProps>(
  ({ className, icon, title, description, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center space-x-3 mb-6', className)}
      {...props}
    >
      {icon && <div className="text-purple-500">{icon}</div>}
      {description ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      ) : (
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      )}
    </div>
  )
);

export default SettingsCardHeader;
