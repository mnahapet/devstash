'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SectionErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Section error]', error, info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2 text-sm text-destructive'>
            <AlertCircle className='h-4 w-4 shrink-0' />
            <span>{this.state.error?.message || 'Failed to load this section.'}</span>
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
