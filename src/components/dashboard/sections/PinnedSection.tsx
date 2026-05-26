import { getPinnedCollections } from '@/lib/db/collections';
import { getPinnedItems } from '@/lib/db/items';
import PinnedItems from '@/components/dashboard/PinnedItems';

export default async function PinnedSection({ userId }: { userId: string }) {
  const [pinnedCollections, pinnedItems] = await Promise.all([
    getPinnedCollections(userId),
    getPinnedItems(userId),
  ]);
  return <PinnedItems pinnedCollections={pinnedCollections} pinnedItems={pinnedItems} />;
}
