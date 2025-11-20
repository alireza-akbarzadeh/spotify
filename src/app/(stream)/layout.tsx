import { AudioPlayerBar } from '@/src/features/player';
import { Header } from '@/components/layout/header';

export default function StreamLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <AudioPlayerBar />
    </>
  );
}
