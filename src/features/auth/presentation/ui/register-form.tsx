'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import React from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signUp } from '@/core/auth/auth-client';
import Link from 'next/link';
import { toast } from 'sonner';
import { SocialLogin } from './social-login';
import { PasswordInput } from './password-input';
import Image from 'next/image';

const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(20),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    const payload = {
      email: values.email.trim(),
      password: values.password.trim(),
      name: values.name.trim(),
      callbackURL: '/',
    };

    await signUp.email(payload, {
      onSuccess: () => {
        toast.success('Account created — check your email!');
        router.push('/');
      },
      onError: (ctx) => {
        toast.error(ctx.error.message);
      },
    });
  }

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex size-full items-center justify-center bg-linear-to-b from-black via-neutral-900 to-black p-6">
      <Card className="w-full max-w-2xl rounded-3xl border-0 bg-white/5 shadow-xl backdrop-blur-xl">
        <CardHeader className="pb-2 text-center">
          <Link href="/" className="mb-2 flex items-center justify-center gap-2">
            <Image src="/images/logo.svg" alt="logo" width={38} height={38} />
            <span className="text-xl font-semibold text-white">Node Base</span>
          </Link>

          <CardTitle className="text-2xl font-bold text-white">Create Your Account</CardTitle>
          <CardDescription className="mt-1 text-neutral-400">
            Join the stream — your music, everywhere.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <SocialLogin />

            <div className="relative flex items-center py-2">
              <div className="grow border-t border-neutral-700/60" />
              <span className="mx-3 text-xs tracking-wide text-neutral-500 uppercase">
                or continue with email
              </span>
              <div className="grow border-t border-neutral-700/60" />
            </div>
          </div>
          <Form {...form}>
            <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-neutral-300">Name</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 border-gray-700 bg-[#121212] text-white placeholder:text-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                        placeholder="Alireza Akbarzadeh"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-neutral-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 border-gray-700 bg-[#121212] text-white placeholder:text-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                        placeholder="devtools@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-neutral-300">Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        className="h-12 border-gray-700 bg-[#121212] text-white placeholder:text-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-neutral-300">Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        className="h-12 border-gray-700 bg-[#121212] text-white placeholder:text-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              {/* ---------- Animated Spotify Button ---------- */}
              <Button
                isLoading={isPending}
                className="hover:shadow-spotify-green-hover/40 shadow-spotify-green/30 hover:bg-spotify-green-hover h-10 w-full rounded-xl bg-[#1DB954] text-sm font-medium shadow-lg transition-all duration-300"
                type="submit"
              >
                Sign Up
              </Button>

              <div className="text-center text-sm text-neutral-400">
                Already have an account?{' '}
                <Link className="text-[#1DB954] hover:underline" href="/login">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
