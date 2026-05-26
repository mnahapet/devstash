import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/db/users';
import SectionErrorBoundary from '@/components/dashboard/SectionErrorBoundary';
import StatsSection from '@/components/dashboard/sections/StatsSection';
import PinnedSection from '@/components/dashboard/sections/PinnedSection';
import FavoritesSection from '@/components/dashboard/sections/FavoritesSection';
import CollectionsSection from '@/components/dashboard/sections/CollectionsSection';
import ItemsSection from '@/components/dashboard/sections/ItemsSection';
import RecentSection from '@/components/dashboard/sections/RecentSection';
import {
  StatsSkeleton,
  CarouselSkeleton,
  GridSkeleton,
} from './skeletons';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ collectionsPage?: string; itemsPage?: string }>;
}) {
  const user = await getUserByEmail('demo@devstash.io');
  if (!user) redirect('/login');

  const params = await searchParams;
  const collectionsPage = Math.max(1, parseInt(params.collectionsPage ?? '1', 10) || 1);
  const itemsPage = Math.max(1, parseInt(params.itemsPage ?? '1', 10) || 1);

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
            <StatsSection userId={user.id} />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<CarouselSkeleton />}>
            <PinnedSection userId={user.id} />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<CarouselSkeleton />}>
            <FavoritesSection userId={user.id} />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<GridSkeleton />}>
            <CollectionsSection userId={user.id} page={collectionsPage} />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<GridSkeleton />}>
            <ItemsSection userId={user.id} page={itemsPage} />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<CarouselSkeleton />}>
            <RecentSection userId={user.id} />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </main>
  );
}
