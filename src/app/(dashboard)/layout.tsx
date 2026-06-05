export const dynamic = 'force-dynamic';

import TopBar from '@/components/layout/TopBar';
import Sidebar from '@/components/layout/Sidebar';
import { ViewProvider } from '@/components/dashboard/view-context';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserById } from '@/lib/db/users';
import { getItemTypesWithCounts } from '@/lib/db/item-types';
import { getSidebarData } from '@/lib/db/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');
  const userId = session.user.id;

  const [user, sidebarData, itemTypes] = await Promise.all([
    getUserById(userId),
    getSidebarData(userId),
    getItemTypesWithCounts(userId),
  ]);

  if (!user) redirect('/sign-in');

  const sidebarUser = { name: user.name ?? null, email: user.email ?? '', image: user.image ?? null };

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
