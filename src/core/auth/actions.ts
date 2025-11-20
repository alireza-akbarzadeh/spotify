'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function loginWithProvider(provider: string) {
  return redirect(`/api/auth/signin/${provider}?callbackURL=/`);
}

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return redirect('/login');
  return session;
}

export async function requireUnAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) return redirect('/');
  return session;
}
