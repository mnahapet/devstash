'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ItemWithType } from '@/lib/db/items';
import ItemRow from './ItemRow';
import ItemCard from './ItemCard';
import { useView } from './view-context';

const PAGE_SIZE = 6;

interface Props {
  items: ItemWithType[];
}

export default function Items({ items }: Props) {
  const { viewMode } = useView();
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > Math.max(1, totalPages)) setPage(Math.max(1, totalPages));
  }, [items.length, page, totalPages]);

  return (
    <section aria-labelledby='items-heading'>
      <div className='flex items-center justify-between mb-3'>
        <h2 id='items-heading' className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
          Items
        </h2>
        {totalPages > 1 && (
          <div className='flex items-center gap-1'>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label='Previous page'
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
              aria-label='Next page'
              className='p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
            >
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>
        )}
      </div>

      {viewMode === 'list' ? (
        <div className='space-y-2'>
          {paged.map(item => (
            <ItemRow key={item.id} item={item} showTypeBorder />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
          {paged.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
