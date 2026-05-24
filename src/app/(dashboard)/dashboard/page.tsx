export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { getCollections, getCollectionStats } from '@/lib/db/collections';
import { getItems, deriveItemStats } from '@/lib/db/items';
import { getItemTypesWithCounts } from '@/lib/db/item-types';
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

  const [collections, collectionStats, items, itemTypes] = await Promise.all([
    getCollections(userId),
    getCollectionStats(userId),
    getItems(userId),
    getItemTypesWithCounts(userId),
  ]);

  const itemStats = deriveItemStats(items);

  // Sidebar data — derived from already-fetched arrays, no extra DB queries
  const sidebarUser = { name: user?.name ?? null, email: user?.email ?? '' };

  const pinnedCollections = collections
    .filter(c => c.isPinned)
    .slice(0, 1)
    .map(c => ({ id: c.id, name: c.name, itemCount: c.itemCount, typeDistribution: c.typeDistribution }));

  const pinnedItems = items
    .filter(i => i.isPinned)
    .slice(0, 1)
    .map(i => ({ id: i.id, title: i.title, itemType: i.itemType }));

  const favoriteSidebarCollections = collections
    .filter(c => c.isFavorite)
    .slice(0, 3)
    .map(c => ({ id: c.id, name: c.name, itemCount: c.itemCount, typeDistribution: c.typeDistribution }));

  const favoriteItems = items
    .filter(i => i.isFavorite)
    .slice(0, 3)
    .map(i => ({ id: i.id, title: i.title, itemType: i.itemType }));

  const recentCollections = collections
    .slice(0, 3)
    .map(c => ({ id: c.id, name: c.name, itemCount: c.itemCount, typeDistribution: c.typeDistribution }));

  const recentItems = items
    .slice(0, 3)
    .map(i => ({ id: i.id, title: i.title, itemType: i.itemType }));

  // Main content data
  const pinnedCollectionsFull = collections.filter(c => c.isPinned);
  const pinnedItemsFull = items.filter(i => i.isPinned);
  const favoriteCollectionsFull = collections.filter(c => c.isFavorite);
  const favoriteItemsFull = items.filter(i => i.isFavorite);

  return (
    <>
      <Sidebar
        user={sidebarUser}
        itemTypes={itemTypes}
        pinnedCollections={pinnedCollections}
        pinnedItems={pinnedItems}
        favoriteCollections={favoriteSidebarCollections}
        favoriteItems={favoriteItems}
        recentCollections={recentCollections}
        recentItems={recentItems}
      />

      <main className='main-scroll flex-1 overflow-y-auto p-6'>
        <div className='max-w-5xl mx-auto space-y-8'>
          <div>
            <h1 className='text-2xl font-bold'>Dashboard</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Your developer knowledge hub
            </p>
          </div>

          <StatsCards collectionStats={collectionStats} itemStats={itemStats} />
          <PinnedItems pinnedCollections={pinnedCollectionsFull} pinnedItems={pinnedItemsFull} />
          <FavoriteItems favoriteCollections={favoriteCollectionsFull} favoriteItems={favoriteItemsFull} />
          <Collections collections={collections} />
          <Items items={items} />
          <RecentCarousel recentCollections={collections.slice(0, 3)} recentItems={items.slice(0, 3)} />
        </div>
      </main>
    </>
  );
}
