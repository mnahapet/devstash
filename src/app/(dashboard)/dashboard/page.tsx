export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { getCollections, getCollectionStats } from '@/lib/db/collections';
import Sidebar from '@/components/layout/Sidebar';
import StatsCards from '@/components/dashboard/StatsCards';
import Collections from '@/components/dashboard/Collections';
import PinnedItems from '@/components/dashboard/PinnedItems';
import FavoriteItems from '@/components/dashboard/FavoriteItems';
import Items from '@/components/dashboard/Items';
import RecentCarousel from '@/components/dashboard/RecentCarousel';

export default async function DashboardPage() {
  const user = await prisma.user.findFirst({ where: { email: 'demo@devstash.io' } });
  const userId = user?.id ?? '';

  const [collections, collectionStats] = await Promise.all([
    getCollections(userId),
    getCollectionStats(userId),
  ]);

  const favoriteSidebarCollections = collections
    .filter(c => c.isFavorite)
    .slice(0, 3)
    .map(c => ({ id: c.id, name: c.name, itemCount: c.itemCount }));

  return (
    <>
      <Sidebar favoriteCollections={favoriteSidebarCollections} />

      <main className='main-scroll flex-1 overflow-y-auto p-6'>
        <div className='max-w-5xl mx-auto space-y-8'>
          <div>
            <h1 className='text-2xl font-bold'>Dashboard</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Your developer knowledge hub
            </p>
          </div>

          <StatsCards collectionStats={collectionStats} />
          <PinnedItems />
          <FavoriteItems />
          <Collections collections={collections} />
          <Items />
          <RecentCarousel />
        </div>
      </main>
    </>
  );
}
