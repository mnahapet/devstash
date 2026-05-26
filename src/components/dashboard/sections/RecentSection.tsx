import { getRecentCollections } from '@/lib/db/collections';
import { getRecentItems } from '@/lib/db/items';
import RecentCarousel from '@/components/dashboard/RecentCarousel';

export default async function RecentSection({ userId }: { userId: string }) {
  const [recentCollections, recentItems] = await Promise.all([
    getRecentCollections(userId),
    getRecentItems(userId),
  ]);
  return <RecentCarousel recentCollections={recentCollections} recentItems={recentItems} />;
}
