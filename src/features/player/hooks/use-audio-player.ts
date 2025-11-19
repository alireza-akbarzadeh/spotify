/**
 * useAudioPlayer Hook
 *
 * Main hook for controlling the audio player.
 * Provides play/pause/next/previous/seek/volume controls
 * and manages the HTML5 Audio element.
 */

'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import {
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
  isLoadingAtom,
  audioElementAtom,
  hasNextTrackAtom,
  hasPreviousTrackAtom,
  nextTrackAtom,
  previousTrackAtom,
} from '../store/player.store';
import type { CurrentTrack, RepeatMode, PlayerControls } from '../types';
// import { useTRPC } from '@/core/api/trpc/client';

/**
 * Main audio player hook
 */
export function useAudioPlayer(): PlayerControls & {
  currentTrack: CurrentTrack | null;
  playbackState: 'playing' | 'paused' | 'loading' | 'idle';
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  hasNextTrack: boolean;
  hasPreviousTrack: boolean;
  error: { code: string; message: string } | null;
} {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Atoms
  const [currentTrack, setCurrentTrack] = useAtom(currentTrackAtom);
  const [playbackState, setPlaybackState] = useAtom(playbackStateAtom);
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [duration, setDuration] = useAtom(durationAtom);
  const [volume, setVolumeState] = useAtom(volumeAtom);
  const [isMuted, setIsMuted] = useAtom(isMutedAtom);
  const [isShuffled, setIsShuffled] = useAtom(isShuffledAtom);
  const [repeatMode, setRepeatModeState] = useAtom(repeatModeAtom);
  const [queue, setQueue] = useAtom(queueAtom);
  const [error, setError] = useAtom(playerErrorAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setAudioElement = useSetAtom(audioElementAtom);

  // Derived values
  const hasNext = useAtomValue(hasNextTrackAtom);
  const hasPrevious = useAtomValue(hasPreviousTrackAtom);
  const nextTrack = useAtomValue(nextTrackAtom);
  const previousTrack = useAtomValue(previousTrackAtom);

  // TRPC mutations (temporarily disabled for testing)
  // const trpc = useTRPC();
  // TODO: Re-enable after fixing TRPC mutation setup
  // const savePlayHistoryMutation = trpc.player.savePlayHistory.useMutation();

  /**
   * Initialize audio element
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [setAudioElement]);

  /**
   * Set up audio event listeners
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setPlaybackState('playing');
    };

    const handlePause = () => {
      setPlaybackState('paused');
    };

    const handleError = () => {
      console.error('Audio playback error');
      setError({
        code: 'PLAYBACK_ERROR',
        message: 'Failed to play audio',
        trackId: currentTrack?.id,
      });
      setPlaybackState('idle');
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
    };
  }, [currentTrack?.id, setCurrentTime, setDuration, setError, setIsLoading, setPlaybackState]);

  /**
   * Handle track ended event
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (!currentTrack) return;

      // Save play history (temporarily disabled)
      // TODO: Re-enable after fixing TRPC mutation
      // savePlayHistoryMutation.mutate({
      //   trackId: currentTrack.id,
      //   duration: Math.floor(duration),
      //   completed: true,
      // });

      // Handle repeat track mode
      if (repeatMode === 'track') {
        audio.currentTime = 0;
        audio.play();
        return;
      }

      // Handle repeat queue mode
      if (repeatMode === 'queue' && !hasNext && queue.tracks.length > 0) {
        const firstTrack = queue.tracks[0].track;
        setCurrentTrack(firstTrack);
        setQueue((prev) => ({ ...prev, currentIndex: 0 }));
        audio.src = firstTrack.audioUrl;
        audio.load();
        audio.play();
        return;
      }

      // Play next track if available
      if (hasNext && nextTrack) {
        if (currentTrack) {
          setQueue((prev) => ({
            ...prev,
            history: [...prev.history, currentTrack],
            currentIndex: prev.currentIndex + 1,
          }));
        }
        setCurrentTrack(nextTrack);
        audio.src = nextTrack.audioUrl;
        audio.load();
        audio.play();
      } else {
        // No more tracks, stop playback
        setPlaybackState('idle');
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [
    currentTrack,
    duration,
    repeatMode,
    hasNext,
    nextTrack,
    queue.tracks,
    setCurrentTrack,
    setPlaybackState,
    setQueue,
  ]);

  /**
   * Update volume when changed
   */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  /**
   * Play function
   */
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    setIsLoading(true);
    audio
      .play()
      .then(() => {
        setPlaybackState('playing');
        setError(null);
      })
      .catch((err) => {
        console.error('Play error:', err);
        setError({
          code: 'PLAYBACK_ERROR',
          message: 'Failed to play audio',
          trackId: currentTrack.id,
        });
        setPlaybackState('idle');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentTrack, setError, setIsLoading, setPlaybackState]);

  /**
   * Pause function
   */
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setPlaybackState('paused');

    // Save play history for paused track (temporarily disabled)
    // TODO: Re-enable after fixing TRPC mutation
    // if (currentTrack && currentTime > 5) {
    //   savePlayHistoryMutation.mutate({
    //     trackId: currentTrack.id,
    //     duration: Math.floor(currentTime),
    //     completed: false,
    //   });
    // }
  }, [setPlaybackState]);

  /**
   * Toggle play/pause
   */
  const toggle = useCallback(() => {
    if (playbackState === 'playing') {
      pause();
    } else {
      play();
    }
  }, [playbackState, play, pause]);

  /**
   * Play a specific track
   */
  const playTrack = useCallback(
    (track: CurrentTrack) => {
      const audio = audioRef.current;
      if (!audio) return;

      setIsLoading(true);
      setCurrentTrack(track);
      audio.src = track.audioUrl;
      audio.load();

      // Auto-play when loaded
      audio.addEventListener(
        'canplay',
        () => {
          play();
        },
        { once: true }
      );
    },
    [play, setCurrentTrack, setIsLoading]
  );

  /**
   * Play a list of tracks
   */
  const playTrackList = useCallback(
    (tracks: CurrentTrack[], startIndex: number = 0) => {
      if (tracks.length === 0) return;

      // Update queue
      setQueue({
        tracks: tracks.map((track, index) => ({
          id: `queue-${index}`,
          track,
          order: index,
          addedAt: new Date(),
        })),
        currentIndex: startIndex,
        history: [],
      });

      // Play the starting track
      playTrack(tracks[startIndex]);
    },
    [playTrack, setQueue]
  );

  /**
   * Next track
   */
  const next = useCallback(() => {
    if (!hasNext || !nextTrack) return;

    // Add current track to history
    if (currentTrack) {
      setQueue((prev) => ({
        ...prev,
        history: [...prev.history, currentTrack],
        currentIndex: prev.currentIndex + 1,
      }));
    }

    playTrack(nextTrack);
  }, [hasNext, nextTrack, currentTrack, playTrack, setQueue]);

  /**
   * Previous track
   */
  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // If more than 3 seconds into track, restart it
    if (currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (!hasPrevious || !previousTrack) return;

    // Move back in queue
    setQueue((prev) => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
      history: prev.history.slice(0, -1),
    }));

    playTrack(previousTrack);
  }, [currentTime, hasPrevious, previousTrack, playTrack, setCurrentTime, setQueue]);

  /**
   * Seek to specific time
   */
  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.currentTime = time;
      setCurrentTime(time);
    },
    [setCurrentTime]
  );

  /**
   * Set volume (0-1)
   */
  const setVolume = useCallback(
    (newVolume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      setVolumeState(clampedVolume);
      if (isMuted && clampedVolume > 0) {
        setIsMuted(false);
      }
    },
    [isMuted, setIsMuted, setVolumeState]
  );

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, [setIsMuted]);

  /**
   * Toggle shuffle
   */
  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => !prev);
    // TODO: Implement shuffle logic for queue
  }, [setIsShuffled]);

  /**
   * Set repeat mode
   */
  const setRepeatMode = useCallback(
    (mode: RepeatMode) => {
      setRepeatModeState(mode);
    },
    [setRepeatModeState]
  );

  /**
   * Add track to queue
   */
  const addToQueue = useCallback(
    (track: CurrentTrack) => {
      setQueue((prev) => ({
        ...prev,
        tracks: [
          ...prev.tracks,
          {
            id: `queue-${Date.now()}`,
            track,
            order: prev.tracks.length,
            addedAt: new Date(),
          },
        ],
      }));
    },
    [setQueue]
  );

  /**
   * Remove track from queue
   */
  const removeFromQueue = useCallback(
    (trackId: string) => {
      setQueue((prev) => ({
        ...prev,
        tracks: prev.tracks.filter((item) => item.id !== trackId),
      }));
    },
    [setQueue]
  );

  /**
   * Clear queue
   */
  const clearQueue = useCallback(() => {
    setQueue({
      tracks: [],
      currentIndex: -1,
      history: [],
    });
  }, [setQueue]);

  return {
    // State
    currentTrack,
    playbackState,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    hasNextTrack: hasNext,
    hasPreviousTrack: hasPrevious,
    error,
    // Controls
    play,
    pause,
    toggle,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    addToQueue,
    removeFromQueue,
    clearQueue,
    playTrack,
    playTrackList,
  };
}
