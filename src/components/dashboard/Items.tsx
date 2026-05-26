'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ItemWithType } from '@/lib/db/items';
import ItemRow from './ItemRow';
import ItemCard from './ItemCard';
import { useView } from './view-context';

interface Props {
  items: ItemWithType[];
  page: number;
  totalPages: number;
}

export default function Items({ items, page, totalPages }: Props) {
  const { viewMode } = useView();

  return (
    <section aria-labelledby='items-heading'>
      <div className='flex items-center justify-between mb-3'>
        <h2 id='items-heading' className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
          Items
        </h2>
        {totalPages > 1 && (
          <div className='flex items-center gap-1'>
            <Link
              href={page > 1 ? `?itemsPage=${page - 1}` : '#'}
              aria-label='Previous page'
              aria-disabled={page === 1}
              className={`p-0.5 rounded text-muted-foreground transition-colors ${page === 1 ? 'opacity-30 pointer-events-none' : 'hover:text-foreground'}`}
            >
              <ChevronLeft className='h-4 w-4' />
            </Link>
            <span className='text-xs text-muted-foreground tabular-nums'>
              {page} / {totalPages}
            </span>
            <Link
              href={page < totalPages ? `?itemsPage=${page + 1}` : '#'}
              aria-label='Next page'
              aria-disabled={page === totalPages}
              className={`p-0.5 rounded text-muted-foreground transition-colors ${page === totalPages ? 'opacity-30 pointer-events-none' : 'hover:text-foreground'}`}
            >
              <ChevronRight className='h-4 w-4' />
            </Link>
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
