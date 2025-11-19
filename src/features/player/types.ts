/**
 * Player Feature Type Definitions
 *
 * This file contains all TypeScript types and interfaces for the audio player feature.
 */

import type { TrackModel } from '../../../prisma/generated/prisma/models/Track';
import type { ArtistModel } from '../../../prisma/generated/prisma/models/Artist';
import type { AlbumModel } from '../../../prisma/generated/prisma/models/Album';

/**
 * Playback state of the audio player
 */
export type PlaybackState = 'playing' | 'paused' | 'loading' | 'idle';

/**
 * Repeat mode options
 */
export type RepeatMode = 'off' | 'track' | 'queue';

/**
 * Current playing track with relationships
 */
export interface CurrentTrack {
  id: string;
  title: string;
  duration: number;
  audioUrl: string;
  coverImage: string | null;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    title: string;
    coverImage: string | null;
  };
}

/**
 * Audio player state
 */
export interface PlayerState {
  currentTrack: CurrentTrack | null;
  playbackState: PlaybackState;
  volume: number; // 0-1
  isMuted: boolean;
  currentTime: number; // in seconds
  duration: number; // in seconds
  isShuffled: boolean;
  repeatMode: RepeatMode;
}

/**
 * Queue item structure
 */
export interface QueueTrack {
  id: string;
  track: CurrentTrack;
  order: number;
  addedAt: Date;
}

/**
 * Player queue state
 */
export interface QueueState {
  tracks: QueueTrack[];
  currentIndex: number;
  history: CurrentTrack[];
}

/**
 * Player controls interface
 */
export interface PlayerControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  addToQueue: (track: CurrentTrack) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  playTrack: (track: CurrentTrack) => void;
  playTrackList: (tracks: CurrentTrack[], startIndex?: number) => void;
}

/**
 * Play history entry for database
 */
export interface PlayHistoryEntry {
  userId: string;
  trackId: string;
  duration: number;
  completed: boolean;
}

/**
 * Track with full relations for API responses
 */
export type TrackWithRelations = TrackModel & {
  artists: Array<
    ArtistModel & {
      id: string;
      name: string;
      image: string | null;
    }
  >;
  album: AlbumModel & {
    id: string;
    title: string;
    coverImage: string | null;
  };
};

/**
 * Player error types
 */
export interface PlayerError {
  code: 'NETWORK_ERROR' | 'PLAYBACK_ERROR' | 'INVALID_TRACK' | 'UNKNOWN_ERROR';
  message: string;
  trackId?: string;
}
