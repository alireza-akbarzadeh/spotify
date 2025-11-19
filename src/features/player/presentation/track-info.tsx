/**
 * Track Info Component
 *
 * Displays current track information (cover, title, artist)
 */

'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CurrentTrack } from '../types';

interface TrackInfoProps {
  track: CurrentTrack | null;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  className?: string;
}

export function TrackInfo({
  track,
  isFavorite = false,
  onToggleFavorite,
  className,
}: TrackInfoProps) {
  if (!track) {
    return (
      <div className={cn('flex w-[30%] min-w-[200px] items-center gap-3', className)}>
        <div className="bg-muted h-14 w-14 rounded" />
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-sm">No track playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex w-[30%] min-w-[200px] items-center gap-3', className)}>
      {/* Album Art */}
      <div className="bg-muted relative h-14 w-14 shrink-0 overflow-hidden rounded">
        {track.coverImage ? (
          <Image
            src={track.coverImage}
            alt={track.title}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-500 to-pink-500">
            <span className="text-xs font-bold text-white">
              {track.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Track Details */}
      <div className="min-w-0 flex-1">
        <p className="cursor-pointer truncate text-sm font-medium hover:underline">{track.title}</p>
        <p className="text-muted-foreground cursor-pointer truncate text-xs hover:underline">
          {track.artists.map((a) => a.name).join(', ')}
        </p>
      </div>

      {/* Favorite Button */}
      {onToggleFavorite && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'text-muted-foreground hover:text-foreground h-8 w-8 shrink-0',
            isFavorite && 'text-green-500 hover:text-green-400'
          )}
          onClick={onToggleFavorite}
        >
          <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
        </Button>
      )}
    </div>
  );
}
