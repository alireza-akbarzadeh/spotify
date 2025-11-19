/**
 * Audio Player Bar Component
 *
 * Bottom fixed player bar - main player UI
 * Matches Spotify's design with track info, controls, and volume
 */

'use client';

import { useAudioPlayer } from '../hooks/use-audio-player';
import { TrackInfo } from './track-info';
import { PlayerControls } from './player-controls';
import { ProgressBar } from './progress-bar';
import { VolumeControl } from './volume-control';
import { cn } from '@/lib/utils';
import type { RepeatMode } from '../types';
import { ListMusic, Mic2, LayoutGrid, Cast, Maximize } from 'lucide-react';

interface AudioPlayerBarProps {
  className?: string;
}

export function AudioPlayerBar({ className }: AudioPlayerBarProps) {
  const player = useAudioPlayer();

  const cycleRepeatMode = () => {
    const modes: RepeatMode[] = ['off', 'queue', 'track'];
    const currentIndex = modes.indexOf(player.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    player.setRepeatMode(nextMode);
  };

  // Don't show player if no track is loaded
  if (!player.currentTrack) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed right-0 bottom-0 left-0 z-50',
        'border-border border-t bg-black',
        'h-20',
        'flex items-center px-4',
        className
      )}
    >
      {/* Left: Track Info */}
      <div className="min-w-[240px] basis-1/3 pr-4">
        <TrackInfo track={player.currentTrack} className="shrink-0" />
      </div>

      {/* Center: Controls + Progress */}
      <div className="flex basis-1/3 flex-col items-center justify-center gap-1">
        <PlayerControls
          isPlaying={player.playbackState === 'playing'}
          isShuffled={player.isShuffled}
          repeatMode={player.repeatMode}
          hasNextTrack={player.hasNextTrack}
          hasPreviousTrack={player.hasPreviousTrack}
          disabled={!player.currentTrack}
          onTogglePlay={player.toggle}
          onNext={player.next}
          onPrevious={player.previous}
          onToggleShuffle={player.toggleShuffle}
          onToggleRepeat={cycleRepeatMode}
        />
        <div className="flex w-full items-center gap-2">
          <span className="text-muted-foreground w-10 text-right text-[10px] tabular-nums">
            {formatTime(player.currentTime)}
          </span>
          <ProgressBar
            currentTime={player.currentTime}
            duration={player.duration}
            onSeek={player.seek}
            showTime={false}
            className="flex-1"
          />
          <span className="text-muted-foreground w-10 text-[10px] tabular-nums">
            {formatTime(player.duration)}
          </span>
        </div>
      </div>

      {/* Right: Actions / Volume */}
      <div className="flex basis-1/3 items-center justify-end gap-3 pl-4">
        <IconButton label="Queue" onClick={() => {}}>
          <ListMusic className="h-4 w-4" />
        </IconButton>
        <IconButton label="Lyrics" onClick={() => {}}>
          <Mic2 className="h-4 w-4" />
        </IconButton>
        <IconButton label="View" onClick={() => {}}>
          <LayoutGrid className="h-4 w-4" />
        </IconButton>
        <IconButton label="Devices" onClick={() => {}}>
          <Cast className="h-4 w-4" />
        </IconButton>
        <VolumeControl
          volume={player.volume}
          isMuted={player.isMuted}
          onVolumeChange={player.setVolume}
          onToggleMute={player.toggleMute}
          className="w-32"
        />
        <IconButton label="Fullscreen" onClick={() => {}}>
          <Maximize className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface IconButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}

function IconButton({ children, onClick, label }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="text-muted-foreground transition-colors hover:text-white"
    >
      {children}
    </button>
  );
}
