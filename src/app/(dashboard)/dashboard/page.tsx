import Sidebar from '@/components/layout/Sidebar';

export default function DashboardPage() {
  return (
    <>
      <Sidebar />

      <main className='flex-1 overflow-y-auto p-6'>
        <h2 className='font-semibold text-sm text-muted-foreground uppercase tracking-wider'>
          Main
        </h2>
      </main>
    </>
  );
}
