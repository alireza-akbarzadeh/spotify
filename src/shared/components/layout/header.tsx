'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserProfile } from '@/src/features/auth/presentation';
import { Bell, DownloadIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-40 flex h-16 w-full items-center border-b border-white/10 bg-black/95 px-6 backdrop-blur-md'
      )}
    >
      <div className="flex w-full items-center justify-between">
        <Image src="/images/spotify.png" alt="Spotify Logo" width={45} height={45} />
        <div>search</div>
        <div className="flex items-center gap-5">
          <Button
            className="h-10 rounded-full bg-white font-semibold text-black"
            variant="secondary"
          >
            Explore Permimum
          </Button>
          <a className="flex items-center gap-2 text-lg text-gray-400 hover:text-white hover:transition-all">
            <DownloadIcon />
            Install App
          </a>
          <Link href="/content-feed">
            <Bell className="size-6 text-amber-50" />
          </Link>
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
