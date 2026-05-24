'use client';

import Link from 'next/link';
import {
  Star,
  Pin,
  Heart,
  FolderOpen,
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
  type LucideIcon,
} from 'lucide-react';
import { mockCollections, mockItemTypes } from '@/lib/mock-data';
import { useView } from './view-context';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

function getDominantTypeColor(distribution: { typeId: string; count: number }[]): string {
  if (!distribution.length) return 'currentColor';
  const dominant = distribution.reduce((max, d) => d.count > max.count ? d : max);
  return mockItemTypes.find(t => t.id === dominant.typeId)?.color ?? 'currentColor';
}

function buildGradient(
  distribution: { typeId: string; count: number }[]
): string {
  const total = distribution.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return 'transparent';

  let cumulative = 0;
  const stops: string[] = [];

  for (const { typeId, count } of distribution) {
    const type = mockItemTypes.find(t => t.id === typeId);
    if (!type) continue;
    const start = (cumulative / total) * 100;
    cumulative += count;
    const end = (cumulative / total) * 100;
    stops.push(`${type.color} ${start}%`, `${type.color} ${end}%`);
  }

  return `linear-gradient(to bottom, ${stops.join(', ')})`;
}

const allCollections = [...mockCollections]
  .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

export default function RecentCollections() {
  const { viewMode } = useView();

  return (
    <section>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
          Collections
        </h2>
        <Link
          href='/collections'
          className='text-xs text-muted-foreground hover:text-foreground transition-colors'
        >
          View all
        </Link>
      </div>

      {viewMode === 'list' ? (
        <div className='space-y-2'>
          {allCollections.map(col => {
            const gradient = buildGradient(col.typeDistribution);
            const typeIcons = col.typeDistribution
              .map(({ typeId }) => mockItemTypes.find(t => t.id === typeId))
              .filter(Boolean);

            return (
              <div
                key={col.id}
                className='group flex rounded-lg border border-border bg-card overflow-hidden hover:border-border/60 hover:bg-accent/20 transition-colors cursor-pointer'
              >
                <div className='w-0.5 shrink-0' style={{ background: gradient }} />
                <div className='flex flex-1 items-start gap-3 px-4 py-3 min-w-0'>
                  <FolderOpen className='h-4 w-4 shrink-0 mt-0.5' style={{ color: getDominantTypeColor(col.typeDistribution) }} />
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-1.5'>
                      <Link
                        href={`/collections/${col.id}`}
                        className='font-semibold text-sm truncate hover:underline'
                      >
                        {col.name}
                      </Link>
                      {col.isFavorite && <Heart className='h-3 w-3 shrink-0 fill-pink-500 text-pink-500' />}
                      {col.isFavorite && <Star className='h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400' />}
                      {col.isPinned && <Pin className='h-3 w-3 shrink-0 fill-white text-white' />}
                    </div>
                    {col.description && (
                      <p className='text-xs text-muted-foreground mt-2 truncate'>{col.description}</p>
                    )}
                    <p className='text-xs text-muted-foreground mt-2'>{col.itemCount} items</p>
                  </div>
                  {typeIcons.length > 0 && (
                    <div className='flex items-center gap-1.5 shrink-0 mt-0.5'>
                      {typeIcons.map(type => {
                        if (!type) return null;
                        const Icon = ICON_MAP[type.icon];
                        return Icon ? (
                          <Icon key={type.id} className='h-3.5 w-3.5' style={{ color: type.color }} />
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
          {allCollections.map(col => {
            const gradient = buildGradient(col.typeDistribution);
            const typeIcons = col.typeDistribution
              .map(({ typeId }) => mockItemTypes.find(t => t.id === typeId))
              .filter(Boolean);

            return (
              <div
                key={col.id}
                className='group flex rounded-lg border border-border bg-card overflow-hidden hover:border-border/60 hover:bg-accent/20 transition-colors cursor-pointer'
              >
                <div className='w-0.5 shrink-0' style={{ background: gradient }} />
                <div className='flex-1 p-4 min-w-0'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex items-center gap-1.5'>
                      <FolderOpen className='h-4 w-4 shrink-0' style={{ color: getDominantTypeColor(col.typeDistribution) }} />
                      <span className='text-xs text-muted-foreground'>{col.itemCount} items</span>
                    </div>
                    <div className='flex items-center gap-1 shrink-0'>
                      {col.isFavorite && <Heart className='h-3.5 w-3.5 fill-pink-500 text-pink-500' />}
                      {col.isFavorite && <Star className='h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />}
                      {col.isPinned && <Pin className='h-3.5 w-3.5 fill-white text-white' />}
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

                  {typeIcons.length > 0 && (
                    <div className='flex items-center gap-2 mt-3'>
                      {typeIcons.map(type => {
                        if (!type) return null;
                        const Icon = ICON_MAP[type.icon];
                        return Icon ? (
                          <Icon key={type.id} className='h-3.5 w-3.5' style={{ color: type.color }} />
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
