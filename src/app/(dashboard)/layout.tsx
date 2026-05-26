export const dynamic = 'force-dynamic';

import TopBar from '@/components/layout/TopBar';
import Sidebar from '@/components/layout/Sidebar';
import { ViewProvider } from '@/components/dashboard/view-context';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/db/users';
import { getItemTypesWithCounts } from '@/lib/db/item-types';
import { getSidebarData } from '@/lib/db/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserByEmail('demo@devstash.io');
  if (!user) redirect('/login');
  const userId = user.id;

  const [sidebarData, itemTypes] = await Promise.all([
    getSidebarData(userId),
    getItemTypesWithCounts(userId),
  ]);

  const sidebarUser = { name: user?.name ?? null, email: user?.email ?? '' };

  const {
    pinnedCollections,
    pinnedItems,
    favoriteCollections,
    favoriteItems,
    recentCollections,
    recentItems,
  } = sidebarData;

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
