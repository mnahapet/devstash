import { Library, Folder, Star, Heart } from 'lucide-react';
import type { CollectionStats } from '@/lib/db/collections';
import type { ItemStats } from '@/lib/db/items';

interface Props {
  collectionStats: CollectionStats;
  itemStats: ItemStats;
}

export default function StatsCards({ collectionStats, itemStats }: Props) {
  const stats = [
    { label: 'Items', value: itemStats.total, icon: Library, iconColor: 'text-foreground fill-foreground', bgColor: 'bg-muted' },
    { label: 'Collections', value: collectionStats.total, icon: Folder, iconColor: 'text-blue-400 fill-blue-400', bgColor: 'bg-blue-500/15' },
    { label: 'Favorite Items', value: itemStats.favorites, icon: Star, iconColor: 'text-yellow-400 fill-yellow-400', bgColor: 'bg-yellow-500/15' },
    { label: 'Favorite Collections', value: collectionStats.favorites, icon: Heart, iconColor: 'text-pink-400 fill-pink-400', bgColor: 'bg-pink-500/15' },
  ];

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
      {stats.map(({ label, value, icon: Icon, iconColor, bgColor }) => (
        <div
          key={label}
          className='rounded-lg border border-border bg-card p-4 flex items-center gap-3'
        >
          <div className={`flex items-center justify-center h-9 w-9 rounded-md shrink-0 ${bgColor || 'bg-muted'}`}>
            <Icon className={`h-4 w-4 ${iconColor || 'text-muted-foreground'}`} />
          </div>
          <div>
            <p className='text-2xl font-bold leading-none'>{value}</p>
            <p className='text-xs text-muted-foreground mt-1'>{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
