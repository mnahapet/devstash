'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useForm } from '@/hooks/useForm';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const { loading, error, handleSubmit } = useForm(async (setError) => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error ?? 'Something went wrong. Please try again.');
    }
  });

  if (!token) {
    return (
      <div className='bg-card border border-border rounded-xl p-6 text-center space-y-2'>
        <p className='text-sm text-muted-foreground'>Invalid reset link.</p>
        <Link href='/forgot-password' className='text-sm text-foreground underline underline-offset-4 hover:no-underline'>
          Request a new one
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className='bg-card border border-border rounded-xl p-8 flex flex-col items-center gap-4 text-center'>
        <CheckCircle className='h-12 w-12 text-green-500' />
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold'>Password Reset!</h2>
          <p className='text-sm text-muted-foreground'>
            Password reset successfully. You can now sign in with your new password.
          </p>
        </div>
        <Link href='/sign-in' className={buttonVariants({ className: 'w-full' })}>
          Sign in with your new password
        </Link>
      </div>
    );
  }

  return (
    <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
      <form onSubmit={handleSubmit} className='space-y-3'>
        <div className='space-y-1.5'>
          <Label htmlFor='password'>New password</Label>
          <Input
            id='password'
            type='password'
            placeholder='••••••••'
            autoComplete='new-password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='confirmPassword'>Confirm new password</Label>
          <Input
            id='confirmPassword'
            type='password'
            placeholder='••••••••'
            autoComplete='new-password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className='text-sm text-destructive'>{error}</p>}

        <Button type='submit' className='w-full' disabled={loading}>
          {loading ? 'Resetting…' : 'Reset password'}
        </Button>
      </form>
    </div>
  );
}
