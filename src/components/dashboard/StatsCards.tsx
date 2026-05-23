import { Package, Folder, Star, BookMarked } from 'lucide-react';
import { mockItems, mockCollections, mockItemTypeCounts } from '@/lib/mock-data';

const totalItems = Object.values(mockItemTypeCounts).reduce((a, b) => a + b, 0);
const totalCollections = mockCollections.length;
const favoriteItems = mockItems.filter(i => i.isFavorite).length;
const favoriteCollections = mockCollections.filter(c => c.isFavorite).length;

const stats = [
  { label: 'Total Items', value: totalItems, icon: Package },
  { label: 'Collections', value: totalCollections, icon: Folder },
  { label: 'Favorite Items', value: favoriteItems, icon: Star },
  { label: 'Favorite Collections', value: favoriteCollections, icon: BookMarked },
];

export default function StatsCards() {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className='rounded-lg border border-border bg-card p-4 flex items-center gap-3'
        >
          <div className='flex items-center justify-center h-9 w-9 rounded-md bg-muted shrink-0'>
            <Icon className='h-4 w-4 text-muted-foreground' />
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
