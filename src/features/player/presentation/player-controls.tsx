/**
 * Player Controls Component
 *
 * Main playback control buttons (shuffle, previous, play/pause, next, repeat)
 */

'use client';

import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RepeatMode } from '../types';

interface PlayerControlsProps {
  isPlaying: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  hasNextTrack: boolean;
  hasPreviousTrack: boolean;
  disabled?: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  className?: string;
}

export function PlayerControls({
  isPlaying,
  isShuffled,
  repeatMode,
  hasNextTrack,
  hasPreviousTrack,
  disabled = false,
  onTogglePlay,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleRepeat,
  className,
}: PlayerControlsProps) {
  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'track':
        return <Repeat1 className="h-4 w-4" />;
      case 'queue':
        return <Repeat className="h-4 w-4" />;
      default:
        return <Repeat className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {/* Shuffle */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'text-muted-foreground hover:text-foreground h-8 w-8 transition-colors',
          isShuffled && 'text-green-500 hover:text-green-400'
        )}
        onClick={onToggleShuffle}
        disabled={disabled}
      >
        <Shuffle className="h-4 w-4" />
      </Button>

      {/* Previous */}
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground h-8 w-8 transition-colors"
        onClick={onPrevious}
        disabled={disabled || !hasPreviousTrack}
      >
        <SkipBack className="h-4 w-4" />
      </Button>

      {/* Play/Pause */}
      <Button
        variant="default"
        size="icon"
        className="h-10 w-10 rounded-full bg-white text-black transition-all hover:scale-105 hover:bg-white/90"
        onClick={onTogglePlay}
        disabled={disabled}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 fill-current" />
        ) : (
          <Play className="ml-0.5 h-5 w-5 fill-current" />
        )}
      </Button>

      {/* Next */}
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground h-8 w-8 transition-colors"
        onClick={onNext}
        disabled={disabled || !hasNextTrack}
      >
        <SkipForward className="h-4 w-4" />
      </Button>

      {/* Repeat */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'text-muted-foreground hover:text-foreground h-8 w-8 transition-colors',
          repeatMode !== 'off' && 'text-green-500 hover:text-green-400'
        )}
        onClick={onToggleRepeat}
        disabled={disabled}
      >
        {getRepeatIcon()}
      </Button>
    </div>
  );
}
