import { redirect } from 'next/navigation';
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
  const user = await getUserByEmail('demo@devstash.io');
  if (!user) redirect('/login');
  const userId = user.id;

  const [collections, items] = await Promise.all([
    getCollections(userId),
    getItems(userId),
  ]);

  return (
    <main className='main-scroll flex-1 overflow-y-auto p-6'>
      <div className='max-w-5xl mx-auto space-y-8'>
        <div>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Your developer knowledge hub
          </p>
        </div>

        <StatsCards
          collectionStats={deriveCollectionStats(collections)}
          itemStats={deriveItemStats(items)}
        />

        <PinnedItems
          pinnedCollections={collections.filter(c => c.isPinned)}
          pinnedItems={items.filter(i => i.isPinned)}
        />

        <FavoriteItems
          favoriteCollections={collections.filter(c => c.isFavorite)}
          favoriteItems={items.filter(i => i.isFavorite)}
        />

        <Collections collections={collections} />

        <Items items={items} />

        <RecentCarousel
          recentCollections={collections.slice(0, 3)}
          recentItems={items.slice(0, 3)}
        />
      </div>
    </main>
  );
}
