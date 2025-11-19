/**
 * Header Component
 *
 * Spotify-like top header with logo, home button, search pill, and actions
 */

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, Bell, CircleUserRound, Download, Home, Users } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-40 h-16 border-b border-white/10 bg-black/95 backdrop-blur-md',
        className
      )}
    >
      <div className="flex h-full items-center justify-between gap-4 px-4 md:px-6">
        {/* Left: Spotify logo */}
        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 1134 340"
              className="h-7 w-auto fill-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zM80 133c-17 6-28-23-9-30 59-18 159-15 221 22 17 9 1 37-17 27-54-32-144-35-195-19z" />
            </svg>
          </div>
        </div>

        {/* Center: Home button + Search pill */}
        <div className="flex flex-1 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-zinc-900 hover:bg-zinc-800"
          >
            <Home className="h-5 w-5" />
          </Button>

          <div className="relative max-w-[720px] flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="What do you want to play?"
              className="h-10 w-full rounded-full border border-white/10 bg-zinc-900/90 pr-11 pl-10 text-sm text-white placeholder:text-gray-400 hover:bg-zinc-800/90 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {/* Right side icon inside the pill */}
            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-md bg-zinc-800 px-2 py-1 text-xs text-gray-300">
              / ⌘K
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden h-9 rounded-full px-4 text-sm font-semibold text-white md:inline-flex"
          >
            <span className="text-black"></span>
            <span className="rounded-full bg-white px-4 py-2 text-black">Explore Premium</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden h-9 gap-2 rounded-full px-3 text-sm text-white hover:bg-zinc-900 md:inline-flex"
          >
            <Download className="h-4 w-4" />
            Install App
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-zinc-900">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-zinc-900">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-zinc-900">
            <CircleUserRound className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
