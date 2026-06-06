'use client';

import { useState } from 'react';

export function ResendVerificationButton({ email }: { email: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  async function handleResend() {
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return <p className='text-sm text-emerald-500'>Verification email resent.</p>;
  }

  return (
    <div className='space-y-1'>
      <button
        onClick={handleResend}
        disabled={status === 'loading'}
        className='text-sm text-muted-foreground underline underline-offset-4 hover:no-underline disabled:opacity-50 cursor-pointer'
      >
        {status === 'loading' ? 'Sending…' : 'Resend verification email'}
      </button>
      {status === 'error' && (
        <p className='text-xs text-destructive'>Failed to resend. Please try again.</p>
      )}
    </div>
  );
}
