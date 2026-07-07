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
          ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
          : 'border-purple-600 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-purple-500',
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
