import Link from 'next/link';
import {
  Star,
  MoreHorizontal,
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

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

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

const recentCollections = [...mockCollections]
  .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  .slice(0, 6);

export default function RecentCollections() {
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

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
        {recentCollections.map(col => {
          const gradient = buildGradient(col.typeDistribution);
          const typeIcons = col.typeDistribution
            .map(({ typeId }) => mockItemTypes.find(t => t.id === typeId))
            .filter(Boolean);

          return (
            <div
              key={col.id}
              className='group flex rounded-lg border border-border bg-card overflow-hidden hover:border-border/60 hover:bg-accent/20 transition-colors cursor-pointer'
            >
              {/* Proportional color strip */}
              <div className='w-0.5 shrink-0' style={{ background: gradient }} />

              {/* Card content */}
              <div className='flex-1 p-4 min-w-0'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='flex items-center gap-1.5 min-w-0'>
                    <Link
                      href={`/collections/${col.id}`}
                      className='font-semibold text-sm truncate hover:underline'
                    >
                      {col.name}
                    </Link>
                    {col.isFavorite && (
                      <Star className='h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400' />
                    )}
                  </div>
                  <button className='opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-0.5 rounded hover:bg-muted'>
                    <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
                  </button>
                </div>

                <p className='text-xs text-muted-foreground mt-1'>
                  {col.itemCount} items
                </p>

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
                        <Icon
                          key={type.id}
                          className='h-3.5 w-3.5'
                          style={{ color: type.color }}
                        />
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
