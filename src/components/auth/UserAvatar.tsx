import Image from 'next/image';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string | null;
  image: string | null;
  className?: string;
  size?: number;
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function UserAvatar({ name, image, className, size = 32 }: UserAvatarProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? 'User avatar'}
        width={size}
        height={size}
        className={cn('rounded-full object-cover', className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-muted text-xs font-semibold shrink-0',
        className
      )}
      style={{ width: size, height: size }}
    >
      {getInitials(name)}
    </div>
  );
}
