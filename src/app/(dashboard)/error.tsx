'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Dashboard layout error]', error);
  }, [error]);

  return (
    <div className='flex h-screen items-center justify-center p-6'>
      <div className='flex flex-col items-center gap-4 text-center max-w-sm'>
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
          <AlertCircle className='h-6 w-6 text-destructive' />
        </div>
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold'>Something went wrong</h2>
          <p className='text-sm text-muted-foreground'>
            {process.env.NODE_ENV === 'development'
              ? error.message
              : 'An unexpected error occurred.'}
          </p>
          {error.digest && (
            <p className='text-xs text-muted-foreground/60'>
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <Button variant='outline' size='sm' onClick={reset}>
          <RefreshCw className='mr-2 h-4 w-4' />
          Try again
        </Button>
      </div>
    </div>
  );
}
