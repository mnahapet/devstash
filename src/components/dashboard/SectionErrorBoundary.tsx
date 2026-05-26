'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InnerProps {
  children: React.ReactNode;
  onReset: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryInner extends React.Component<InnerProps, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Section error]', error, info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2 text-sm text-destructive'>
            <AlertCircle className='h-4 w-4 shrink-0' />
            <span>
              {process.env.NODE_ENV === 'development'
                ? this.state.error?.message ?? 'Failed to load this section.'
                : 'Failed to load this section.'}
            </span>
          </div>
          <Button variant='ghost' size='sm' onClick={this.reset} className='shrink-0'>
            <RefreshCw className='mr-1.5 h-3.5 w-3.5' />
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function SectionErrorBoundary({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const handleReset = useCallback(() => router.refresh(), [router]);
  return <ErrorBoundaryInner onReset={handleReset}>{children}</ErrorBoundaryInner>;
}
