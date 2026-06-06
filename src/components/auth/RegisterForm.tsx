'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@/hooks/useForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { loading, error, handleSubmit } = useForm(async (setError) => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.emailVerificationRequired) {
        router.push(`/check-your-email?email=${encodeURIComponent(email)}`);
      } else {
        router.push('/sign-in');
      }
    } else {
      const data = await res.json();
      setError(data.error ?? 'Registration failed');
    }
  });

  return (
    <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
      <form onSubmit={handleSubmit} className='space-y-3'>
        <div className='space-y-1.5'>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            type='text'
            placeholder='Brad Traversy'
            autoComplete='name'
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

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

        <div className='space-y-1.5'>
          <Label htmlFor='password'>Password</Label>
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
          <Label htmlFor='confirmPassword'>Confirm password</Label>
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
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </div>
  );
}
