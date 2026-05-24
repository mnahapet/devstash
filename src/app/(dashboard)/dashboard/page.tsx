import Sidebar from '@/components/layout/Sidebar';
import StatsCards from '@/components/dashboard/StatsCards';
import Collections from '@/components/dashboard/Collections';
import PinnedItems from '@/components/dashboard/PinnedItems';
import FavoriteItems from '@/components/dashboard/FavoriteItems';
import Items from '@/components/dashboard/Items';
import RecentCarousel from '@/components/dashboard/RecentCarousel';

export default function DashboardPage() {
  return (
    <>
      <Sidebar />

      <main className='main-scroll flex-1 overflow-y-auto p-6'>
        <div className='max-w-5xl mx-auto space-y-8'>
          <div>
            <h1 className='text-2xl font-bold'>Dashboard</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Your developer knowledge hub
            </p>
          </div>

          <StatsCards />
          <PinnedItems />
          <FavoriteItems />
          <Collections />
          <Items />
          <RecentCarousel />
        </div>
      </main>
    </>
  );
}
