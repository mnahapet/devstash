'use client';

import { useState } from 'react';
import { useForm } from '@/hooks/useForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const { loading, error, handleSubmit } = useForm(async (setError) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json();
      setError(data.error ?? 'Something went wrong. Please try again.');
    }
  });

  if (sent) {
    return (
      <div className='bg-card border border-border rounded-xl p-6'>
        <p className='text-sm text-center text-muted-foreground'>
          If that email is registered, a reset link is on its way. Check your inbox.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
      <form onSubmit={handleSubmit} className='space-y-3'>
        <div className='space-y-1.5'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='you@example.com'
            autoComplete='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        {error && <p className='text-sm text-destructive'>{error}</p>}

        <Button type='submit' className='w-full' disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
    </div>
  );
}
