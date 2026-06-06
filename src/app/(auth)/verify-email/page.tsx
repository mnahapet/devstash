import Link from 'next/link';
import { Layers, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (!token) {
    const message =
      error === 'expired'
        ? 'Verification link has expired. Please request a new one.'
        : 'Invalid verification link.';
    return <ErrorPage message={message} />;
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return <ErrorPage message='Invalid or expired verification link.' />;
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return <ErrorPage message='Verification link has expired. Please request a new one.' />;
  }

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return <SuccessPage />;
}

function SuccessPage() {
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
          <div className='rounded-full bg-emerald-500/10 p-3'>
            <CheckCircle className='h-6 w-6 text-emerald-500' />
          </div>
        </div>
        <div className='space-y-1'>
          <h1 className='text-lg font-semibold'>Email Verified!</h1>
          <p className='text-sm text-muted-foreground'>Email verified successfully</p>
        </div>
        <Link href='/sign-in'>
          <Button className='w-full'>Sign in to your account</Button>
        </Link>
      </div>
    </div>
  );
}

function ErrorPage({ message }: { message: string }) {
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
