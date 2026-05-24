'use client';

import { mockItems } from '@/lib/mock-data';
import ItemRow from './ItemRow';
import ItemCard from './ItemCard';
import { useView } from './view-context';

const allItems = [...mockItems]
  .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

export default function Items() {
  const { viewMode } = useView();

  return (
    <section>
      <div className='flex items-center gap-2 mb-3'>
        <h2 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
          Items
        </h2>
      </div>

      {viewMode === 'list' ? (
        <div className='space-y-2'>
          {allItems.map(item => (
            <ItemRow key={item.id} item={item} showTypeBorder />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
          {allItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
