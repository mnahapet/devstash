import { Suspense } from 'react';
import { getUserByEmail } from '@/lib/db/users';
import { getCollections, deriveCollectionStats } from '@/lib/db/collections';
import { getItems, deriveItemStats } from '@/lib/db/items';
import StatsCards from '@/components/dashboard/StatsCards';
import Collections from '@/components/dashboard/Collections';
import PinnedItems from '@/components/dashboard/PinnedItems';
import FavoriteItems from '@/components/dashboard/FavoriteItems';
import Items from '@/components/dashboard/Items';
import RecentCarousel from '@/components/dashboard/RecentCarousel';
import { SectionErrorBoundary } from '@/components/dashboard/SectionErrorBoundary';
import { StatsSkeleton, CarouselSkeleton, GridSkeleton } from './skeletons';

// ─── Async section components ────────────────────────────────────────────────

async function StatsSection({ userId }: { userId: string }) {
  const [collections, items] = await Promise.all([
    getCollections(userId),
    getItems(userId),
  ]);
  return (
    <StatsCards
      collectionStats={deriveCollectionStats(collections)}
      itemStats={deriveItemStats(items)}
    />
  );
}

async function PinnedSection({ userId }: { userId: string }) {
  const [collections, items] = await Promise.all([
    getCollections(userId),
    getItems(userId),
  ]);
  return (
    <PinnedItems
      pinnedCollections={collections.filter(c => c.isPinned)}
      pinnedItems={items.filter(i => i.isPinned)}
    />
  );
}

async function FavoritesSection({ userId }: { userId: string }) {
  const [collections, items] = await Promise.all([
    getCollections(userId),
    getItems(userId),
  ]);
  return (
    <FavoriteItems
      favoriteCollections={collections.filter(c => c.isFavorite)}
      favoriteItems={items.filter(i => i.isFavorite)}
    />
  );
}

async function CollectionsSection({ userId }: { userId: string }) {
  const collections = await getCollections(userId);
  return <Collections collections={collections} />;
}

async function ItemsSection({ userId }: { userId: string }) {
  const items = await getItems(userId);
  return <Items items={items} />;
}

async function RecentSection({ userId }: { userId: string }) {
  const [collections, items] = await Promise.all([
    getCollections(userId),
    getItems(userId),
  ]);
  return (
    <RecentCarousel
      recentCollections={collections.slice(0, 3)}
      recentItems={items.slice(0, 3)}
    />
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const user = await getUserByEmail('demo@devstash.io');
  const userId = user?.id ?? '';

  return (
    <main className='main-scroll flex-1 overflow-y-auto p-6'>
      <div className='max-w-5xl mx-auto space-y-8'>
        <div>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Your developer knowledge hub
          </p>
        </div>

        <SectionErrorBoundary>
          <Suspense fallback={<StatsSkeleton />}>
            <StatsSection userId={userId} />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<CarouselSkeleton />}>
            <PinnedSection userId={userId} />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<CarouselSkeleton />}>
            <FavoritesSection userId={userId} />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<GridSkeleton />}>
            <CollectionsSection userId={userId} />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<GridSkeleton />}>
            <ItemsSection userId={userId} />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<CarouselSkeleton />}>
            <RecentSection userId={userId} />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </main>
  );
}
