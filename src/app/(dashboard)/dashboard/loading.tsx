import { Skeleton, StatsSkeleton, CarouselSkeleton, GridSkeleton } from './skeletons';

export default function DashboardLoading() {
  return (
    <main className='main-scroll flex-1 overflow-y-auto p-6 relative'>
      <div className='max-w-5xl mx-auto space-y-8'>
        <div className='space-y-2'>
          <Skeleton className='h-7 w-32' />
          <Skeleton className='h-4 w-52' />
        </div>

        <StatsSkeleton />
        <CarouselSkeleton />
        <CarouselSkeleton />
        <GridSkeleton />
        <GridSkeleton />
      </div>

      {/* Spinner centered over skeleton */}
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
        <div className='loader-spinner' />
      </div>
    </main>
  );
}
