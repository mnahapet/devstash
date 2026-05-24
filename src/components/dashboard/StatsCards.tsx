import { Package, Folder, Star, Heart } from 'lucide-react';
import { mockItems, mockCollections, mockItemTypeCounts } from '@/lib/mock-data';

const totalItems = Object.values(mockItemTypeCounts).reduce((a, b) => a + b, 0);
const totalCollections = mockCollections.length;
const favoriteItems = mockItems.filter(i => i.isFavorite).length;
const favoriteCollections = mockCollections.filter(c => c.isFavorite).length;

const stats = [
  { label: 'Total Items', value: totalItems, icon: Package, iconColor: '', bgColor: '' },
  { label: 'Collections', value: totalCollections, icon: Folder, iconColor: '', bgColor: '' },
  { label: 'Favorite Items', value: favoriteItems, icon: Star, iconColor: '', bgColor: '' },
  { label: 'Favorite Collections', value: favoriteCollections, icon: Heart, iconColor: 'text-pink-400', bgColor: 'bg-pink-500/15' },
];

export default function StatsCards() {
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
