'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockItems } from '@/lib/mock-data';
import ItemRow from './ItemRow';
import ItemCard from './ItemCard';
import { useView } from './view-context';

const PAGE_SIZE = 6;

const sortedItems = [...mockItems]
  .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

export default function Items() {
  const { viewMode } = useView();
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(sortedItems.length / PAGE_SIZE);
  const items = sortedItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
          Items
        </h2>
        {totalPages > 1 && (
          <div className='flex items-center gap-1'>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className='p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
            >
              <ChevronLeft className='h-4 w-4' />
            </button>
            <span className='text-xs text-muted-foreground tabular-nums'>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
            >
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>
        )}
      </div>

      {viewMode === 'list' ? (
        <div className='space-y-2'>
          {items.map(item => (
            <ItemRow key={item.id} item={item} showTypeBorder />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
