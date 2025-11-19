import { PrismaClient } from './generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎵 Starting music database seed...');

  // Create Genres
  const genres = await Promise.all([
    prisma.genre.upsert({
      where: { name: 'Pop' },
      update: {},
      create: { name: 'Pop', color: '#FF69B4', image: '/genres/pop.jpg' },
    }),
    prisma.genre.upsert({
      where: { name: 'Rock' },
      update: {},
      create: { name: 'Rock', color: '#8B4513', image: '/genres/rock.jpg' },
    }),
    prisma.genre.upsert({
      where: { name: 'Hip Hop' },
      update: {},
      create: { name: 'Hip Hop', color: '#FFD700', image: '/genres/hiphop.jpg' },
    }),
    prisma.genre.upsert({
      where: { name: 'Electronic' },
      update: {},
      create: { name: 'Electronic', color: '#00CED1', image: '/genres/electronic.jpg' },
    }),
    prisma.genre.upsert({
      where: { name: 'Jazz' },
      update: {},
      create: { name: 'Jazz', color: '#800080', image: '/genres/jazz.jpg' },
    }),
    prisma.genre.upsert({
      where: { name: 'Classical' },
      update: {},
      create: { name: 'Classical', color: '#2F4F4F', image: '/genres/classical.jpg' },
    }),
  ]);

  console.log(`✅ Created ${genres.length} genres`);

  // Create Artists
  const artist1 = await prisma.artist.upsert({
    where: { id: 'artist-1' },
    update: {},
    create: {
      id: 'artist-1',
      name: 'The Weekend Sound',
      bio: 'Award-winning artist with over 100M streams worldwide',
      image: '/artists/weekend.jpg',
      verified: true,
      monthlyListeners: 50000000,
    },
  });

  const artist2 = await prisma.artist.upsert({
    where: { id: 'artist-2' },
    update: {},
    create: {
      id: 'artist-2',
      name: 'Electric Dreams',
      bio: 'Electronic music pioneer',
      image: '/artists/electric.jpg',
      verified: true,
      monthlyListeners: 25000000,
    },
  });

  const artist3 = await prisma.artist.upsert({
    where: { id: 'artist-3' },
    update: {},
    create: {
      id: 'artist-3',
      name: 'Jazz Masters',
      bio: 'Legendary jazz ensemble',
      image: '/artists/jazz.jpg',
      verified: true,
      monthlyListeners: 10000000,
    },
  });

  console.log('✅ Created 3 artists');

  // Create Albums
  const album1 = await prisma.album.upsert({
    where: { id: 'album-1' },
    update: {},
    create: {
      id: 'album-1',
      title: 'Midnight Dreams',
      description: 'A journey through sound and emotion',
      coverImage: '/albums/midnight.jpg',
      releaseDate: new Date('2024-01-15'),
      albumType: 'ALBUM',
      artistId: artist1.id,
    },
  });

  const album2 = await prisma.album.upsert({
    where: { id: 'album-2' },
    update: {},
    create: {
      id: 'album-2',
      title: 'Electric Pulse',
      description: 'High-energy electronic beats',
      coverImage: '/albums/pulse.jpg',
      releaseDate: new Date('2024-03-20'),
      albumType: 'ALBUM',
      artistId: artist2.id,
    },
  });

  const album3 = await prisma.album.upsert({
    where: { id: 'album-3' },
    update: {},
    create: {
      id: 'album-3',
      title: 'Smooth Sessions',
      description: 'Classic jazz recordings',
      coverImage: '/albums/smooth.jpg',
      releaseDate: new Date('2023-11-10'),
      albumType: 'ALBUM',
      artistId: artist3.id,
    },
  });

  console.log('✅ Created 3 albums');

  // Create Tracks
  const tracks = await Promise.all([
    prisma.track.create({
      data: {
        title: 'Starlight',
        duration: 245,
        audioUrl: '/audio/starlight.mp3',
        coverImage: '/albums/midnight.jpg',
        trackNumber: 1,
        playCount: 5420000,
        albumId: album1.id,
        artists: {
          create: {
            artistId: artist1.id,
            order: 0,
          },
        },
        genres: {
          create: {
            genreId: genres[0].id,
          },
        },
      },
    }),
    prisma.track.create({
      data: {
        title: 'Neon Lights',
        duration: 198,
        audioUrl: '/audio/neon.mp3',
        coverImage: '/albums/pulse.jpg',
        trackNumber: 1,
        playCount: 3200000,
        albumId: album2.id,
        artists: {
          create: {
            artistId: artist2.id,
            order: 0,
          },
        },
        genres: {
          create: {
            genreId: genres[3].id,
          },
        },
      },
    }),
    prisma.track.create({
      data: {
        title: 'Blue Notes',
        duration: 312,
        audioUrl: '/audio/blue.mp3',
        coverImage: '/albums/smooth.jpg',
        trackNumber: 1,
        playCount: 1800000,
        albumId: album3.id,
        artists: {
          create: {
            artistId: artist3.id,
            order: 0,
          },
        },
        genres: {
          create: {
            genreId: genres[4].id,
          },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${tracks.length} tracks`);

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@music.com' },
    update: {},
    create: {
      email: 'test@music.com',
      name: 'Music Lover',
      emailVerified: true,
      image: '/users/default.jpg',
    },
  });

  // Create a playlist
  await prisma.playlist.create({
    data: {
      name: 'My Favorites',
      description: 'Best tracks of all time',
      isPublic: true,
      userId: testUser.id,
      tracks: {
        create: tracks.map((track, index) => ({
          trackId: track.id,
          order: index,
        })),
      },
    },
  });

  console.log('✅ Created test user and playlist');
  console.log('\n🎉 Seed completed successfully!');
  console.log(`\n📊 Summary:`);
  console.log(`   - ${genres.length} Genres`);
  console.log(`   - 3 Artists`);
  console.log(`   - 3 Albums`);
  console.log(`   - ${tracks.length} Tracks`);
  console.log(`   - 1 Test User`);
  console.log(`   - 1 Playlist`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
