'use client';

import { Clock } from 'lucide-react';
import { mockItems } from '@/lib/mock-data';
import ItemRow from './ItemRow';
import ItemCard from './ItemCard';
import { useView } from './view-context';

const recentItems = [...mockItems]
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  .slice(0, 10);

export default function RecentItems() {
  const { viewMode } = useView();

  return (
    <section>
      <div className='flex items-center gap-2 mb-3'>
        <Clock className='h-3.5 w-3.5 text-muted-foreground' />
        <h2 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
          Recent Items
        </h2>
      </div>

      {viewMode === 'list' ? (
        <div className='space-y-2'>
          {recentItems.map(item => (
            <ItemRow key={item.id} item={item} showTypeBorder />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
          {recentItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
