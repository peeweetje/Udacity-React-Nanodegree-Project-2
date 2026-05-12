import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'w-24 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white dark:ring-offset-gray-900 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-teal-500 text-neutral-50 hover:bg-teal-600 hover:text-neutral-50',
        destructive:
          'bg-red-500 text-neutral-50 hover:bg-red-600 hover:text-neutral-50',
        outline:
          'border border-teal-500 bg-white dark:bg-gray-800 text-neutral-900 dark:text-white hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:text-neutral-900 dark:hover:text-white',
        secondary: 'bg-teal-100 dark:bg-teal-900/50 text-neutral-800 dark:text-neutral-200 hover:bg-teal-200/80 dark:hover:bg-teal-800/50',
        ghost: 'hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:text-neutral-900 dark:hover:text-white',
        link: 'text-teal-500 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
