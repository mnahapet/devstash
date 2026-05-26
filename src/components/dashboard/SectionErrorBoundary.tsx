'use client';

import { Component, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface State { hasError: boolean }

class ErrorBoundaryInner extends Component<{ children: ReactNode; onReset: () => void }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm'>
          <div className='flex items-center gap-2 text-destructive'>
            <AlertCircle className='h-4 w-4 shrink-0' />
            <span>
              {process.env.NODE_ENV === 'development'
                ? 'Section failed to load'
                : 'Something went wrong'}
            </span>
          </div>
          <button
            onClick={this.props.onReset}
            className='flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors'
          >
            <RefreshCw className='h-3 w-3' />
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function SectionErrorBoundary({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [key, setKey] = useState(0);

  const handleReset = () => {
    router.refresh();
    setKey(k => k + 1);
  };

  return (
    <ErrorBoundaryInner key={key} onReset={handleReset}>
      {children}
    </ErrorBoundaryInner>
  );
}
