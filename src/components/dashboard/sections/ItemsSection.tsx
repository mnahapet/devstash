import { getItems, getItemStats } from '@/lib/db/items';
import Items from '@/components/dashboard/Items';

const PAGE_SIZE = 6;

export default async function ItemsSection({
  userId,
  page,
}: {
  userId: string;
  page: number;
}) {
  const [items, { total }] = await Promise.all([
    getItems(userId, page, PAGE_SIZE),
    getItemStats(userId),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  return <Items items={items} page={safePage} totalPages={totalPages} />;
}
