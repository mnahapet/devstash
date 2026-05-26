export const dynamic = 'force-dynamic';

import TopBar from '@/components/layout/TopBar';
import Sidebar from '@/components/layout/Sidebar';
import { ViewProvider } from '@/components/dashboard/view-context';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/db/users';
import { getCollections } from '@/lib/db/collections';
import { getItems } from '@/lib/db/items';
import { getItemTypesWithCounts } from '@/lib/db/item-types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserByEmail('demo@devstash.io');
  if (!user) redirect('/login');
  const userId = user.id;

  const [collections, items, itemTypes] = await Promise.all([
    getCollections(userId),
    getItems(userId),
    getItemTypesWithCounts(userId),
  ]);

  const sidebarUser = { name: user?.name ?? null, email: user?.email ?? '' };

  const pinnedCollections = collections
    .filter(c => c.isPinned)
    .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 1)
    .map(c => ({ id: c.id, name: c.name, itemCount: c.itemCount, typeDistribution: c.typeDistribution }));

  const pinnedItems = items
    .filter(i => i.isPinned)
    .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 1)
    .map(i => ({ id: i.id, title: i.title, itemType: i.itemType }));

  const favoriteCollections = collections
    .filter(c => c.isFavorite)
    .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3)
    .map(c => ({ id: c.id, name: c.name, itemCount: c.itemCount, typeDistribution: c.typeDistribution }));

  const favoriteItems = items
    .filter(i => i.isFavorite)
    .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3)
    .map(i => ({ id: i.id, title: i.title, itemType: i.itemType }));

  const recentCollections = collections
    .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3)
    .map(c => ({ id: c.id, name: c.name, itemCount: c.itemCount, typeDistribution: c.typeDistribution }));

  const recentItems = items
    .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3)
    .map(i => ({ id: i.id, title: i.title, itemType: i.itemType }));

  return (
    <ViewProvider>
      <div className='flex flex-col h-screen'>
        <TopBar />
        <div className='flex flex-1 overflow-hidden'>
          <Sidebar
            user={sidebarUser}
            itemTypes={itemTypes}
            pinnedCollections={pinnedCollections}
            pinnedItems={pinnedItems}
            favoriteCollections={favoriteCollections}
            favoriteItems={favoriteItems}
            recentCollections={recentCollections}
            recentItems={recentItems}
          />
          {children}
        </div>
      </div>
    </ViewProvider>
  );
}
