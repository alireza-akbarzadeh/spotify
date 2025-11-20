'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

//
// ✔ Spotify Button Palette
// Uses Tailwind v4 CSS variables from your @theme config
//
const buttonVariants = cva(
  'relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all select-none disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
  {
    variants: {
      variant: {
        //
        // ✔ DEFAULT (Spotify Green)
        //
        default:
          'bg-[--color-spotify-green] text-black px-8 h-11 shadow-lg shadow-[--color-spotify-green]/25 ' +
          'hover:bg-[--color-spotify-green-hover] hover:scale-[1.03] active:scale-[0.98] ' +
          'focus-visible:ring-[--color-spotify-green]',

        //
        // ✔ Outline (dark+soft Spotify border)
        //
        outline: 'border border-[--color-border] bg-transparent text-white ' + 'hover:bg-white/10',

        //
        // ✔ Secondary (Spotify card gray)
        //
        secondary:
          'bg-[--color-secondary] text-[--color-secondary-foreground] ' +
          'hover:bg-[--color-secondary]/80',

        //
        // ✔ Ghost (clean dark transparent)
        //
        ghost: 'text-white hover:bg-white/10',

        //
        // ✔ Destructive (custom)
        //
        destructive: 'bg-[--color-destructive] text-white hover:bg-[--color-destructive]/90',

        //
        // ✔ Link (Spotify text link)
        //
        link: 'text-[--color-spotify-green] underline-offset-4 hover:underline',
      },

      size: {
        default: 'h-10 px-6 text-sm',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'size-10 p-0',
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
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      type,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled ?? isLoading;

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-state={isLoading ? 'loading' : undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        type={type ?? 'button'}
        onClick={isLoading ? undefined : onClick}
        {...props}
      >
        {/* Content fades out when loading */}
        <span
          className={cn(
            'flex items-center gap-2 transition-opacity duration-200',
            isLoading && 'opacity-0'
          )}
        >
          {children}
        </span>

        {/* Spotify Loader Overlay */}
        {isLoading && (
          <span className="absolute inset-0 grid place-items-center">
            <Spinner />
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
