/**
 * Player Service - TRPC Router
 *
 * Handles all server-side operations for the music player:
 * - Fetching track details
 * - Saving play history
 * - Updating track play counts
 * - Queue management persistence
 */

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/core/api/trpc/init';
import { TRPCError } from '@trpc/server';
import { logger } from '@/shared/lib';

/**
 * Player router with all player-related procedures
 */
export const playerRouter = createTRPCRouter({
  /**
   * Get track details with full relations (artists, album)
   */
  getTrack: publicProcedure
    .input(z.object({ trackId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { trackId } = input;

      logger.debug({ trackId, requestId: ctx.requestId }, 'Fetching track details');

      const track = await ctx.db.track.findUnique({
        where: { id: trackId },
        include: {
          artists: {
            include: {
              artist: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          album: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              artistId: true,
            },
          },
        },
      });

      if (!track) {
        logger.warn({ trackId, requestId: ctx.requestId }, 'Track not found');
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Track not found',
        });
      }

      // Transform to CurrentTrack format
      return {
        id: track.id,
        title: track.title,
        duration: track.duration,
        audioUrl: track.audioUrl,
        coverImage: track.coverImage || track.album.coverImage,
        artists: track.artists.map((ta) => ({
          id: ta.artist.id,
          name: ta.artist.name,
        })),
        album: {
          id: track.album.id,
          title: track.album.title,
          coverImage: track.album.coverImage,
        },
      };
    }),

  /**
   * Get multiple tracks by IDs
   */
  getTracks: publicProcedure
    .input(z.object({ trackIds: z.array(z.string()) }))
    .query(async ({ input, ctx }) => {
      const { trackIds } = input;

      logger.debug({ trackIds, requestId: ctx.requestId }, 'Fetching multiple tracks');

      const tracks = await ctx.db.track.findMany({
        where: { id: { in: trackIds } },
        include: {
          artists: {
            include: {
              artist: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          album: {
            select: {
              id: true,
              title: true,
              coverImage: true,
            },
          },
        },
      });

      return tracks.map((track) => ({
        id: track.id,
        title: track.title,
        duration: track.duration,
        audioUrl: track.audioUrl,
        coverImage: track.coverImage || track.album.coverImage,
        artists: track.artists.map((ta) => ({
          id: ta.artist.id,
          name: ta.artist.name,
        })),
        album: {
          id: track.album.id,
          title: track.album.title,
          coverImage: track.album.coverImage,
        },
      }));
    }),

  /**
   * Save play history entry (protected - requires authentication)
   */
  savePlayHistory: protectedProcedure
    .input(
      z.object({
        trackId: z.string(),
        duration: z.number(), // how long the user listened (seconds)
        completed: z.boolean(), // whether the track was fully played
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { trackId, duration, completed } = input;

      logger.info(
        {
          userId: ctx.userId,
          trackId,
          duration,
          completed,
          requestId: ctx.requestId,
        },
        'Saving play history'
      );

      // Create play history entry
      const playHistory = await ctx.db.playHistory.create({
        data: {
          userId: ctx.userId!,
          trackId,
          duration,
          completed,
          playedAt: new Date(),
        },
      });

      // Update track play count if completed
      if (completed) {
        await ctx.db.track.update({
          where: { id: trackId },
          data: {
            playCount: {
              increment: 1,
            },
          },
        });

        logger.debug({ trackId, requestId: ctx.requestId }, 'Incremented track play count');
      }

      return {
        success: true,
        playHistoryId: playHistory.id,
      };
    }),

  /**
   * Get user's play history
   */
  getPlayHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, offset } = input;

      logger.debug(
        {
          userId: ctx.userId,
          limit,
          offset,
          requestId: ctx.requestId,
        },
        'Fetching play history'
      );

      const history = await ctx.db.playHistory.findMany({
        where: { userId: ctx.userId! },
        include: {
          track: {
            include: {
              artists: {
                include: {
                  artist: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              album: {
                select: {
                  id: true,
                  title: true,
                  coverImage: true,
                },
              },
            },
          },
        },
        orderBy: {
          playedAt: 'desc',
        },
        take: limit,
        skip: offset,
      });

      return history.map((entry) => ({
        id: entry.id,
        playedAt: entry.playedAt,
        duration: entry.duration,
        completed: entry.completed,
        track: {
          id: entry.track.id,
          title: entry.track.title,
          duration: entry.track.duration,
          audioUrl: entry.track.audioUrl,
          coverImage: entry.track.coverImage || entry.track.album.coverImage,
          artists: entry.track.artists.map((ta) => ({
            id: ta.artist.id,
            name: ta.artist.name,
          })),
          album: {
            id: entry.track.album.id,
            title: entry.track.album.title,
            coverImage: entry.track.album.coverImage,
          },
        },
      }));
    }),

  /**
   * Get user's queue from database
   */
  getQueue: protectedProcedure.query(async ({ ctx }) => {
    logger.debug({ userId: ctx.userId, requestId: ctx.requestId }, 'Fetching user queue');

    const queueItems = await ctx.db.queueItem.findMany({
      where: { userId: ctx.userId! },
      include: {
        track: {
          include: {
            artists: {
              include: {
                artist: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            album: {
              select: {
                id: true,
                title: true,
                coverImage: true,
              },
            },
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return queueItems.map((item) => ({
      id: item.id,
      order: item.order,
      addedAt: item.createdAt,
      track: {
        id: item.track.id,
        title: item.track.title,
        duration: item.track.duration,
        audioUrl: item.track.audioUrl,
        coverImage: item.track.coverImage || item.track.album.coverImage,
        artists: item.track.artists.map((ta) => ({
          id: ta.artist.id,
          name: ta.artist.name,
        })),
        album: {
          id: item.track.album.id,
          title: item.track.album.title,
          coverImage: item.track.album.coverImage,
        },
      },
    }));
  }),

  /**
   * Save user's queue to database
   */
  saveQueue: protectedProcedure
    .input(
      z.object({
        tracks: z.array(
          z.object({
            trackId: z.string(),
            order: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { tracks } = input;

      logger.info(
        {
          userId: ctx.userId,
          trackCount: tracks.length,
          requestId: ctx.requestId,
        },
        'Saving user queue'
      );

      // Delete existing queue items
      await ctx.db.queueItem.deleteMany({
        where: { userId: ctx.userId! },
      });

      // Create new queue items
      if (tracks.length > 0) {
        await ctx.db.queueItem.createMany({
          data: tracks.map((t) => ({
            userId: ctx.userId!,
            trackId: t.trackId,
            order: t.order,
          })),
        });
      }

      return {
        success: true,
        queueSize: tracks.length,
      };
    }),

  /**
   * Clear user's queue
   */
  clearQueue: protectedProcedure.mutation(async ({ ctx }) => {
    logger.info({ userId: ctx.userId, requestId: ctx.requestId }, 'Clearing user queue');

    const deleted = await ctx.db.queueItem.deleteMany({
      where: { userId: ctx.userId! },
    });

    return {
      success: true,
      deletedCount: deleted.count,
    };
  }),

  /**
   * Add track to queue
   */
  addToQueue: protectedProcedure
    .input(z.object({ trackId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { trackId } = input;

      logger.info(
        {
          userId: ctx.userId,
          trackId,
          requestId: ctx.requestId,
        },
        'Adding track to queue'
      );

      // Get max order number
      const maxOrder = await ctx.db.queueItem.findFirst({
        where: { userId: ctx.userId! },
        orderBy: { order: 'desc' },
        select: { order: true },
      });

      const newOrder = (maxOrder?.order ?? -1) + 1;

      const queueItem = await ctx.db.queueItem.create({
        data: {
          userId: ctx.userId!,
          trackId,
          order: newOrder,
        },
      });

      return {
        success: true,
        queueItemId: queueItem.id,
        order: newOrder,
      };
    }),

  /**
   * Remove track from queue
   */
  removeFromQueue: protectedProcedure
    .input(z.object({ queueItemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { queueItemId } = input;

      logger.info(
        {
          userId: ctx.userId,
          queueItemId,
          requestId: ctx.requestId,
        },
        'Removing track from queue'
      );

      await ctx.db.queueItem.delete({
        where: {
          id: queueItemId,
          userId: ctx.userId!, // Ensure user owns this queue item
        },
      });

      return {
        success: true,
      };
    }),
});
