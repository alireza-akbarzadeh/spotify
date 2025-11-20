'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react';
import { signIn } from '@/lib/auth-client';
import { toast } from 'sonner';
import { cn } from '@/src/shared/lib/utils';

interface AuthProviderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: string;
  label: string;
  icon: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

export function AuthProviderButton(props: AuthProviderButtonProps) {
  const { provider, label, icon, className, type = 'button', ...rest } = props;
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      await signIn.social({
        provider: provider as 'github' | 'google' | 'discord',
        callbackURL: '/',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={cn(
        'h-12 gap-2 border-gray-700 bg-transparent text-white hover:border-gray-600 hover:bg-gray-900',
        className
      )}
      onClick={onClick}
      isLoading={loading}
      type={type}
      {...rest}
    >
      <Image src={icon} width={20} height={20} alt={label} />
      {label}
    </Button>
  );
}
