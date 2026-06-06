import Link from 'next/link';
import { Layers, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ERROR_MESSAGES: Record<string, string> = {
  invalid: 'Invalid or expired verification link.',
  expired: 'Verification link has expired. Please request a new one.',
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error
    ? (ERROR_MESSAGES[error] ?? 'Something went wrong.')
    : 'Invalid verification link.';

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
          <div className='rounded-full bg-destructive/10 p-3'>
            <XCircle className='h-6 w-6 text-destructive' />
          </div>
        </div>
        <div className='space-y-1'>
          <h1 className='text-lg font-semibold'>Verification failed</h1>
          <p className='text-sm text-muted-foreground'>{message}</p>
        </div>
      </div>

      <div className='flex justify-center'>
        <Link href='/register'>
          <Button variant='outline'>Back to register</Button>
        </Link>
      </div>
    </div>
  );
}
