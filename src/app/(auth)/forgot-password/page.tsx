import Link from 'next/link';
import { Layers } from 'lucide-react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className='w-full max-w-sm space-y-6'>
      <div className='flex flex-col items-center gap-2'>
        <div className='flex items-center gap-2'>
          <Layers className='h-6 w-6' />
          <span className='text-xl font-bold tracking-tight'>DevStash</span>
        </div>
        <p className='text-sm text-muted-foreground'>Reset your password</p>
      </div>

      <ForgotPasswordForm />

      <p className='text-center text-sm text-muted-foreground'>
        <Link href='/sign-in' className='text-foreground underline underline-offset-4 hover:no-underline'>
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
