'use client';

import { Pin } from 'lucide-react';
import { mockItems } from '@/lib/mock-data';
import ItemRow from './ItemRow';
import ItemCard from './ItemCard';
import { useView } from './view-context';

const pinnedItems = mockItems.filter(i => i.isPinned);

export default function PinnedItems() {
  const { viewMode } = useView();

  if (pinnedItems.length === 0) return null;

  return (
    <section>
      <div className='flex items-center gap-2 mb-3'>
        <Pin className='h-3.5 w-3.5 text-muted-foreground' />
        <h2 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
          Pinned
        </h2>
      </div>

      {viewMode === 'list' ? (
        <div className='space-y-2'>
          {pinnedItems.map(item => (
            <ItemRow key={item.id} item={item} showTypeBorder />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
          {pinnedItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
