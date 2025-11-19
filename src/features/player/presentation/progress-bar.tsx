/**
 * Progress Bar Component
 *
 * Seekable progress bar showing current playback position
 */

'use client';

import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
  showTime?: boolean;
}

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function ProgressBar({
  currentTime,
  duration,
  onSeek,
  className,
  showTime = true,
}: ProgressBarProps) {
  const handleValueChange = (value: number[]) => {
    onSeek(value[0]);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showTime && (
        <span className="text-muted-foreground min-w-[40px] text-right text-xs tabular-nums">
          {formatTime(currentTime)}
        </span>
      )}
      <Slider
        value={[currentTime]}
        max={duration || 100}
        step={1}
        onValueChange={handleValueChange}
        className="flex-1 cursor-pointer"
      />
      {showTime && (
        <span className="text-muted-foreground min-w-[40px] text-xs tabular-nums">
          {formatTime(duration)}
        </span>
      )}
    </div>
  );
}
