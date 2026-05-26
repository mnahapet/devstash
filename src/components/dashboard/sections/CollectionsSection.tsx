import { getCollections, getCollectionStats } from '@/lib/db/collections';
import Collections from '@/components/dashboard/Collections';

const PAGE_SIZE = 6;

export default async function CollectionsSection({
  userId,
  page,
}: {
  userId: string;
  page: number;
}) {
  const [collections, { total }] = await Promise.all([
    getCollections(userId, page, PAGE_SIZE),
    getCollectionStats(userId),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  return <Collections collections={collections} page={safePage} totalPages={totalPages} />;
}
