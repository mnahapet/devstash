import { getUserByEmail } from '@/lib/db/users';
import { getCollections, deriveCollectionStats } from '@/lib/db/collections';
import { getItems, deriveItemStats } from '@/lib/db/items';
import StatsCards from '@/components/dashboard/StatsCards';
import Collections from '@/components/dashboard/Collections';
import PinnedItems from '@/components/dashboard/PinnedItems';
import FavoriteItems from '@/components/dashboard/FavoriteItems';
import Items from '@/components/dashboard/Items';
import RecentCarousel from '@/components/dashboard/RecentCarousel';

export default async function DashboardPage() {
  // TODO: replace with getUserById(session.user.id) once NextAuth is wired up
  const user = await getUserByEmail('demo@devstash.io');
  const userId = user?.id ?? '';

  // Both calls hit React cache — layout already ran these queries
  const [collections, items] = await Promise.all([
    getCollections(userId),
    getItems(userId),
  ]);

  const collectionStats = deriveCollectionStats(collections);
  const itemStats = deriveItemStats(items);

  const pinnedCollectionsFull = collections.filter(c => c.isPinned);
  const pinnedItemsFull = items.filter(i => i.isPinned);
  const favoriteCollectionsFull = collections.filter(c => c.isFavorite);
  const favoriteItemsFull = items.filter(i => i.isFavorite);

  return (
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
  );
}
