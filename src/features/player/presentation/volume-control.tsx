/**
 * Volume Control Component
 *
 * Volume slider with mute toggle
 */

'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VolumeControlProps {
  volume: number; // 0-1
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  className?: string;
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  className,
}: VolumeControlProps) {
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="h-4 w-4" />;
    }
    if (volume < 0.5) {
      return <Volume1 className="h-4 w-4" />;
    }
    return <Volume2 className="h-4 w-4" />;
  };

  const handleVolumeChange = (value: number[]) => {
    onVolumeChange(value[0] / 100);
  };

  return (
    <div className={cn('flex min-w-[150px] items-center gap-2', className)}>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground h-8 w-8 transition-colors"
        onClick={onToggleMute}
      >
        {getVolumeIcon()}
      </Button>
      <Slider
        value={[isMuted ? 0 : volume * 100]}
        max={100}
        step={1}
        onValueChange={handleVolumeChange}
        className="w-24 cursor-pointer"
      />
    </div>
  );
}
