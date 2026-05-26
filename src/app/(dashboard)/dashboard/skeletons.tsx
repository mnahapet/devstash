function Spinner() {
  return (
    <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
      <div className='loader-spinner-sm' />
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export function StatsSkeleton() {
  return (
    <div className='relative'>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='rounded-lg border border-border bg-card p-4 flex items-center gap-3'>
            <Skeleton className='h-9 w-9 rounded-md shrink-0' />
            <div className='space-y-1.5'>
              <Skeleton className='h-6 w-8' />
              <Skeleton className='h-3 w-20' />
            </div>
          </div>
        ))}
      </div>
      <Spinner />
    </div>
  );
}

export function CarouselSkeleton() {
  return (
    <div className='relative space-y-3'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-28' />
        <div className='flex gap-1'>
          <Skeleton className='h-7 w-7 rounded-md' />
          <Skeleton className='h-7 w-7 rounded-md' />
        </div>
      </div>
      <div className='flex gap-3 overflow-hidden'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='min-w-50 rounded-lg border border-border bg-card p-4 space-y-2'>
            <div className='flex items-start justify-between'>
              <Skeleton className='h-5 w-5 rounded-sm' />
              <Skeleton className='h-4 w-8' />
            </div>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-3 w-24' />
          </div>
        ))}
      </div>
      <Spinner />
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className='relative space-y-3'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-24' />
        <div className='flex gap-1'>
          <Skeleton className='h-7 w-7 rounded-md' />
          <Skeleton className='h-7 w-7 rounded-md' />
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='rounded-lg border border-border bg-card p-4 flex flex-col gap-2 min-h-30'>
            <div className='flex items-start justify-between'>
              <Skeleton className='h-5 w-5 rounded-sm' />
              <div className='flex gap-1'>
                <Skeleton className='h-4 w-4' />
                <Skeleton className='h-4 w-4' />
              </div>
            </div>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-full' />
            <Skeleton className='h-3 w-2/3' />
            <div className='mt-auto flex gap-1 pt-2'>
              <Skeleton className='h-4 w-12 rounded-full' />
              <Skeleton className='h-4 w-10 rounded-full' />
            </div>
          </div>
        ))}
      </div>
      <Spinner />
    </div>
  );
}
