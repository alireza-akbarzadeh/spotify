'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <h1 className="text-spotify-green text-9xl font-bold">404</h1>
        </div>
        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white">Page Not Found</h2>
        <p className="mb-8 text-lg text-gray-400">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been
          moved, deleted, or never existed.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="bg-spotify-green hover:bg-spotify-green-hover focus-visible:ring-spotify-green inline-flex h-11 items-center justify-center rounded-full px-8 text-sm font-medium text-black shadow transition-all hover:scale-105 focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex h-11 items-center justify-center rounded-full border border-gray-700 bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-all hover:border-gray-600 hover:bg-gray-900 focus-visible:ring-1 focus-visible:ring-gray-600 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
