import { getFavoriteCollections } from '@/lib/db/collections';
import { getFavoriteItems } from '@/lib/db/items';
import FavoriteItems from '@/components/dashboard/FavoriteItems';

export default async function FavoritesSection({ userId }: { userId: string }) {
  const [favoriteCollections, favoriteItems] = await Promise.all([
    getFavoriteCollections(userId),
    getFavoriteItems(userId),
  ]);
  return <FavoriteItems favoriteCollections={favoriteCollections} favoriteItems={favoriteItems} />;
}
