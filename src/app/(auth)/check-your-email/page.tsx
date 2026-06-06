import Link from 'next/link';
import { Layers, Mail } from 'lucide-react';
import { ResendVerificationButton } from '@/components/auth/ResendVerificationButton';

export default async function CheckYourEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className='w-full max-w-sm space-y-6'>
      <div className='flex flex-col items-center gap-2'>
        <div className='flex items-center gap-2'>
          <Layers className='h-6 w-6' />
          <span className='text-xl font-bold tracking-tight'>DevStash</span>
        </div>
      </div>

      <div className='bg-card border border-border rounded-xl p-6 space-y-4 text-center'>
        <div className='flex justify-center'>
          <div className='rounded-full bg-muted p-3'>
            <Mail className='h-6 w-6 text-muted-foreground' />
          </div>
        </div>
        <div className='space-y-1'>
          <h1 className='text-lg font-semibold'>Check your email</h1>
          <p className='text-sm text-muted-foreground'>
            We sent a verification link to{' '}
            {email ? (
              <span className='text-foreground font-medium'>{email}</span>
            ) : (
              'your email address'
            )}
            .
          </p>
        </div>
        <p className='text-xs text-muted-foreground'>
          Click the link in the email to verify your account. The link expires in 1 hour.
        </p>
        {email && <ResendVerificationButton email={email} />}
      </div>

      <p className='text-center text-sm text-muted-foreground'>
        Already verified?{' '}
        <Link
          href='/sign-in'
          className='text-foreground underline underline-offset-4 hover:no-underline'
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
