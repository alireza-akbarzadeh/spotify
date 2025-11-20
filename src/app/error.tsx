'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console
    console.error('Application error:', error);

    // Send to Sentry
    Sentry.captureException(error, {
      tags: {
        errorBoundary: 'app',
      },
      contexts: {
        errorInfo: {
          digest: error.digest,
          message: error.message,
        },
      },
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <div className="text-6xl">⚠️</div>
        </div>
        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white">
          Something went wrong!
        </h2>
        <p className="mb-2 text-lg text-gray-400">
          {error.message || 'An unexpected error occurred'}
        </p>
        {error.digest && (
          <p className="mb-8 font-mono text-sm text-gray-500">Error ID: {error.digest}</p>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()}>Try again</Button>
          <button
            onClick={() => (window.location.href = '/')}
            className="inline-flex h-11 items-center justify-center rounded-full border border-gray-700 bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-all hover:border-gray-600 hover:bg-gray-900 focus-visible:ring-1 focus-visible:ring-gray-600 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
