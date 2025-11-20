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
import { signIn } from '@/lib/auth-client';
import Link from 'next/link';
import { toast } from 'sonner';
import { SocialLogin } from './social-login';
import { PasswordInput } from './password-input';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'min characters for password is 1'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    await signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          toast.success('successfully logged in. Welcome back!');
          router.push('/');
        },
        onError: (context) => {
          toast.error(context.error.message);
        },
      }
    );
  }

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex size-full items-center justify-center bg-linear-to-b from-black via-neutral-900 to-black p-6">
      <Card className="w-full max-w-2xl rounded-3xl border-0 bg-white/5 shadow-xl backdrop-blur-xl">
        <CardHeader className="pb-2 text-center">
          <Link href="/" className="mb-2 flex items-center justify-center gap-2">
            <div className="bg-spotify-green flex h-10 w-10 items-center justify-center rounded-full">
              <svg className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white">Spotify</span>
          </Link>

          <CardTitle className="text-2xl font-bold text-white">Log in to Spotify</CardTitle>
          <CardDescription className="mt-1 text-neutral-400">
            Continue listening to your favorite music
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-neutral-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 border-gray-700 bg-[#121212] text-white placeholder:text-gray-500 focus:border-white focus:ring-1 focus:ring-white"
                        placeholder="Email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
                name="email"
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
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                isLoading={isPending}
                className="hover:shadow-spotify-green-hover/40 shadow-spotify-green/30 hover:bg-spotify-green-hover h-10 w-full rounded-xl bg-[#1DB954] text-sm font-medium shadow-lg transition-all duration-300"
                type="submit"
              >
                Log In
              </Button>

              <div className="text-center text-sm text-neutral-400">
                Don&apos;t have an account?{' '}
                <Link className="text-[#1DB954] hover:underline" href="/signup">
                  Sign up for Spotify
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
