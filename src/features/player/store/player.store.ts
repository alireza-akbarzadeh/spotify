/**
 * Audio Player State Management
 *
 * Uses Jotai atoms for global player state management.
 * This provides a lightweight, reactive state solution for the audio player.
 */

'use client';

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { CurrentTrack, PlaybackState, RepeatMode, QueueState, PlayerError } from '../types';

/**
 * Current playing track
 */
export const currentTrackAtom = atom<CurrentTrack | null>(null);

/**
 * Playback state (playing, paused, loading, idle)
 */
export const playbackStateAtom = atom<PlaybackState>('idle');

/**
 * Current playback time in seconds
 */
export const currentTimeAtom = atom<number>(0);

/**
 * Track duration in seconds
 */
export const durationAtom = atom<number>(0);

/**
 * Volume level (0-1) - persisted to localStorage
 */
export const volumeAtom = atomWithStorage<number>('spotify-volume', 0.7);

/**
 * Mute state - persisted to localStorage
 */
export const isMutedAtom = atomWithStorage<boolean>('spotify-muted', false);

/**
 * Shuffle state - persisted to localStorage
 */
export const isShuffledAtom = atomWithStorage<boolean>('spotify-shuffle', false);

/**
 * Repeat mode (off, track, queue) - persisted to localStorage
 */
export const repeatModeAtom = atomWithStorage<RepeatMode>('spotify-repeat', 'off');

/**
 * Queue state containing all queued tracks
 */
export const queueAtom = atom<QueueState>({
  tracks: [],
  currentIndex: -1,
  history: [],
});

/**
 * Player error state
 */
export const playerErrorAtom = atom<PlayerError | null>(null);

/**
 * Loading state for async operations
 */
export const isLoadingAtom = atom<boolean>(false);

/**
 * Audio element reference (for imperative audio control)
 * This is managed internally and shouldn't be accessed directly
 */
export const audioElementAtom = atom<HTMLAudioElement | null>(null);

/**
 * Derived atom: Check if player has a track loaded
 */
export const hasTrackAtom = atom((get) => get(currentTrackAtom) !== null);

/**
 * Derived atom: Check if player is playing
 */
export const isPlayingAtom = atom((get) => get(playbackStateAtom) === 'playing');

/**
 * Derived atom: Check if player is paused
 */
export const isPausedAtom = atom((get) => get(playbackStateAtom) === 'paused');

/**
 * Derived atom: Get current progress as percentage (0-100)
 */
export const progressPercentageAtom = atom((get) => {
  const currentTime = get(currentTimeAtom);
  const duration = get(durationAtom);

  if (duration === 0) return 0;
  return (currentTime / duration) * 100;
});

/**
 * Derived atom: Check if there's a next track in queue
 */
export const hasNextTrackAtom = atom((get) => {
  const queue = get(queueAtom);
  return queue.currentIndex < queue.tracks.length - 1;
});

/**
 * Derived atom: Check if there's a previous track in history
 */
export const hasPreviousTrackAtom = atom((get) => {
  const queue = get(queueAtom);
  return queue.currentIndex > 0 || queue.history.length > 0;
});

/**
 * Derived atom: Get next track without mutating queue
 */
export const nextTrackAtom = atom((get) => {
  const queue = get(queueAtom);
  const nextIndex = queue.currentIndex + 1;

  if (nextIndex < queue.tracks.length) {
    return queue.tracks[nextIndex].track;
  }

  return null;
});

/**
 * Derived atom: Get previous track
 */
export const previousTrackAtom = atom((get) => {
  const queue = get(queueAtom);
  const previousIndex = queue.currentIndex - 1;

  if (previousIndex >= 0) {
    return queue.tracks[previousIndex].track;
  }

  if (queue.history.length > 0) {
    return queue.history[queue.history.length - 1];
  }

  return null;
});

/**
 * Formatted time display (MM:SS)
 */
export const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Derived atom: Formatted current time
 */
export const formattedCurrentTimeAtom = atom((get) => {
  return formatTime(get(currentTimeAtom));
});

/**
 * Derived atom: Formatted duration
 */
export const formattedDurationAtom = atom((get) => {
  return formatTime(get(durationAtom));
});
