/**
 * Player Feature Barrel Export
 *
 * Single entry point for player feature exports
 */

// Types
export type * from './types';

// Hooks
export { useAudioPlayer } from './hooks/use-audio-player';

// Store atoms (for advanced usage)
export {
  currentTrackAtom,
  playbackStateAtom,
  currentTimeAtom,
  durationAtom,
  volumeAtom,
  isMutedAtom,
  isShuffledAtom,
  repeatModeAtom,
  queueAtom,
  playerErrorAtom,
  formatTime,
  formattedCurrentTimeAtom,
  formattedDurationAtom,
  progressPercentageAtom,
  hasNextTrackAtom,
  hasPreviousTrackAtom,
  isPlayingAtom,
  isPausedAtom,
  hasTrackAtom,
} from './store/player.store';

// UI Components
export { AudioPlayerBar } from './presentation/audio-player-bar';
export { PlayerControls } from './presentation/player-controls';
export { ProgressBar } from './presentation/progress-bar';
export { TrackInfo } from './presentation/track-info';
export { VolumeControl } from './presentation/volume-control';

// Services (TRPC router) - server-side only, imported directly where needed
// export { playerRouter } from './services/player.service';
