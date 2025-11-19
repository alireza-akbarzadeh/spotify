import React from 'react';
import { Header } from '@/components/layout/header';
import { AudioPlayerBar } from '@/src/features/player';

export default function HomePage() {
  return (
    <div className="flex h-[calc(100vh-90px)] flex-col overflow-hidden bg-linear-to-b from-[#3c2464] via-[#181818] to-black">
      <Header />

      {/* Content area reserves space above fixed player bar (90px) */}
      <main className="flex-1 overflow-y-scroll">{/* Main content placeholder */}</main>
      <AudioPlayerBar />
    </div>
  );
}
