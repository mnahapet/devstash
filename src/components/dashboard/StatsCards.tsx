import { Library, Folder, Star, Heart, type LucideIcon } from 'lucide-react';
import type { CollectionStats } from '@/lib/db/collections';
import type { ItemStats } from '@/lib/db/items';

interface Props {
  collectionStats: CollectionStats;
  itemStats: ItemStats;
}

const STATS_CONFIG: {
  label: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  getValue: (c: CollectionStats, i: ItemStats) => number;
}[] = [
  { label: 'Items', icon: Library, iconColor: 'text-foreground fill-foreground', bgColor: 'bg-muted', getValue: (_, i) => i.total },
  { label: 'Collections', icon: Folder, iconColor: 'text-blue-400 fill-blue-400', bgColor: 'bg-blue-500/15', getValue: c => c.total },
  { label: 'Favorite Items', icon: Star, iconColor: 'text-yellow-400 fill-yellow-400', bgColor: 'bg-yellow-500/15', getValue: (_, i) => i.favorites },
  { label: 'Favorite Collections', icon: Heart, iconColor: 'text-pink-400 fill-pink-400', bgColor: 'bg-pink-500/15', getValue: c => c.favorites },
];

export default function StatsCards({ collectionStats, itemStats }: Props) {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
      {STATS_CONFIG.map(({ label, getValue, icon: Icon, iconColor, bgColor }) => (
        <div
          key={label}
          className='rounded-lg border border-border bg-card p-4 flex items-center gap-3'
        >
          <div className={`flex items-center justify-center h-9 w-9 rounded-md shrink-0 ${bgColor || 'bg-muted'}`}>
            <Icon className={`h-4 w-4 ${iconColor || 'text-muted-foreground'}`} />
          </div>
          <div>
            <p className='text-2xl font-bold leading-none'>{getValue(collectionStats, itemStats)}</p>
            <p className='text-xs text-muted-foreground mt-1'>{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
