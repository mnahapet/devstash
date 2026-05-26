import { getCollectionStats } from '@/lib/db/collections';
import { getItemStats } from '@/lib/db/items';
import StatsCards from '@/components/dashboard/StatsCards';

export default async function StatsSection({ userId }: { userId: string }) {
  const [collectionStats, itemStats] = await Promise.all([
    getCollectionStats(userId),
    getItemStats(userId),
  ]);
  return <StatsCards collectionStats={collectionStats} itemStats={itemStats} />;
}
