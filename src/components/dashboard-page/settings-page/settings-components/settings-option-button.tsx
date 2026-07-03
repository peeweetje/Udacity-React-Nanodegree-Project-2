import * as React from 'react';
import { cn } from '@/lib/utils';

interface SettingsOptionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const SettingsOptionButton = React.forwardRef<HTMLButtonElement, SettingsOptionButtonProps>(
  ({ className, selected = false, icon, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'flex-1 py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all flex items-center justify-center space-x-2',
        selected
          ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
          : 'border-teal-600 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-teal-500',
        className
      )}
      {...props}
    >
      {icon && <span className="h-4 w-4">{icon}</span>}
      <span>{children}</span>
    </button>
  )
);

export default SettingsOptionButton;
