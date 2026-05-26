'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Pin, Heart, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CollectionWithStats } from '@/lib/db/collections';
import { useView } from './view-context';
import { ICON_MAP, getDominantTypeColor, buildGradient } from '@/lib/constants/item-types';

const PAGE_SIZE = 6;

interface Props {
  collections: CollectionWithStats[];
}

export default function Collections({ collections }: Props) {
  const { viewMode } = useView();
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(collections.length / PAGE_SIZE);
  const paged = collections.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section aria-labelledby='collections-heading'>
      <div className='flex items-center justify-between mb-3'>
        <h2 id='collections-heading' className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
          Collections
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
          {paged.map(col => {
            const gradient = buildGradient(col.typeDistribution);

            return (
              <div
                key={col.id}
                className='group flex rounded-lg border border-border bg-card overflow-hidden hover:border-border/60 hover:bg-accent/20 transition-colors cursor-pointer'
              >
                <div className='w-0.5 shrink-0' style={{ background: gradient }} />
                <div className='flex flex-1 items-start gap-3 px-4 py-3 min-w-0'>
                  <FolderOpen
                    className='h-4 w-4 shrink-0 mt-0.5'
                    style={{ color: getDominantTypeColor(col.typeDistribution) }}
                  />
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-1.5'>
                      <Link
                        href={`/collections/${col.id}`}
                        className='font-semibold text-sm truncate hover:underline'
                      >
                        {col.name}
                      </Link>
                      {col.isFavorite && <Heart className='h-3 w-3 shrink-0 fill-pink-500 text-pink-500' />}
                      {col.hasFavoriteItem && <Star className='h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400' />}
                      {col.isPinned && <Pin className='h-3 w-3 shrink-0 fill-foreground text-foreground' />}
                    </div>
                    {col.description && (
                      <p className='text-xs text-muted-foreground mt-2 truncate'>{col.description}</p>
                    )}
                    <p className='text-xs text-muted-foreground mt-2'>{col.itemCount} items</p>
                  </div>
                  {col.typeDistribution.length > 0 && (
                    <div className='flex items-center gap-1.5 shrink-0 mt-0.5'>
                      {col.typeDistribution.map(({ typeId, icon, color }) => {
                        const Icon = ICON_MAP[icon];
                        return Icon ? (
                          <Icon key={typeId} className='h-3.5 w-3.5' style={{ color }} />
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
          {paged.map(col => {
            const gradient = buildGradient(col.typeDistribution);

            return (
              <div
                key={col.id}
                className='group flex rounded-lg border border-border bg-card overflow-hidden hover:border-border/60 hover:bg-accent/20 transition-colors cursor-pointer'
              >
                <div className='w-0.5 shrink-0' style={{ background: gradient }} />
                <div className='flex flex-col flex-1 p-4 min-w-0'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex items-center gap-1.5'>
                      <FolderOpen
                        className='h-4 w-4 shrink-0'
                        style={{ color: getDominantTypeColor(col.typeDistribution) }}
                      />
                      <span className='text-xs text-muted-foreground'>{col.itemCount} items</span>
                    </div>
                    <div className='flex items-center gap-1 shrink-0'>
                      {col.isFavorite && <Heart className='h-3.5 w-3.5 fill-pink-500 text-pink-500' />}
                      {col.hasFavoriteItem && <Star className='h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />}
                      {col.isPinned && <Pin className='h-3.5 w-3.5 fill-foreground text-foreground' />}
                    </div>
                  </div>

                  <Link
                    href={`/collections/${col.id}`}
                    className='mt-2 block font-semibold text-sm line-clamp-2 hover:underline'
                  >
                    {col.name}
                  </Link>

                  {col.description && (
                    <p className='text-xs text-muted-foreground mt-2 line-clamp-2'>
                      {col.description}
                    </p>
                  )}

                  {col.typeDistribution.length > 0 && (
                    <div className='flex items-center gap-2 mt-auto pt-3'>
                      {col.typeDistribution.map(({ typeId, icon, color }) => {
                        const Icon = ICON_MAP[icon];
                        return Icon ? (
                          <Icon key={typeId} className='h-3.5 w-3.5' style={{ color }} />
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
