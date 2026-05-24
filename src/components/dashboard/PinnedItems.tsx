'use client';

import { useState, useEffect } from 'react';
import {
  Pin, Star, MoreHorizontal, ChevronLeft, ChevronRight,
  Code, Sparkles, Terminal, StickyNote, File, Image,
  Link as LinkIcon, type LucideIcon,
} from 'lucide-react';
import { mockItems, mockCollections, mockItemTypes } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

const ICON_MAP: Record<string, LucideIcon> = {
  Code, Sparkles, Terminal, StickyNote, File, Image, Link: LinkIcon,
};

function buildGradient(distribution: { typeId: string; count: number }[]): string {
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

const pinnedCollections = [...mockCollections]
  .filter(c => c.isPinned)
  .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

const pinnedItems = [...mockItems]
  .filter(i => i.isPinned)
  .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

type PinnedCard =
  | { kind: 'collection'; data: typeof pinnedCollections[0] }
  | { kind: 'item'; data: typeof pinnedItems[0] };

const allPinned: PinnedCard[] = [
  ...pinnedCollections.map(c => ({ kind: 'collection' as const, data: c })),
  ...pinnedItems.map(i => ({ kind: 'item' as const, data: i })),
];

function CollectionCard({ col }: { col: typeof pinnedCollections[0] }) {
  const gradient = buildGradient(col.typeDistribution);
  const typeIcons = col.typeDistribution
    .map(({ typeId }) => mockItemTypes.find(t => t.id === typeId))
    .filter(Boolean);

  return (
    <div className='group flex rounded-lg border border-border bg-card overflow-hidden hover:border-border/60 hover:bg-accent/20 transition-colors cursor-pointer h-full'>
      <div className='w-0.5 shrink-0' style={{ background: gradient }} />
      <div className='flex-1 p-4 min-w-0'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-1.5 min-w-0'>
            <span className='font-semibold text-sm truncate'>{col.name}</span>
            {col.isFavorite && <Star className='h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400' />}
          </div>
          <button className='opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-0.5 rounded hover:bg-muted'>
            <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
          </button>
        </div>
        <p className='text-xs text-muted-foreground mt-1'>{col.itemCount} items</p>
        {col.description && (
          <p className='text-xs text-muted-foreground mt-2 line-clamp-2'>{col.description}</p>
        )}
        {typeIcons.length > 0 && (
          <div className='flex items-center gap-2 mt-3'>
            {typeIcons.map(type => {
              if (!type) return null;
              const Icon = ICON_MAP[type.icon];
              return Icon ? <Icon key={type.id} className='h-3.5 w-3.5' style={{ color: type.color }} /> : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemCard({ item }: { item: typeof pinnedItems[0] }) {
  const itemType = mockItemTypes.find(t => t.id === item.itemTypeId);
  const Icon = itemType ? ICON_MAP[itemType.icon] : null;
  const date = item.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div
      className='flex flex-col rounded-lg border border-border bg-card p-3 hover:bg-accent/30 transition-colors cursor-pointer h-full'
      style={itemType?.color ? { borderLeftWidth: '2px', borderLeftColor: itemType.color } : undefined}
    >
      <div className='flex items-start justify-between gap-2'>
        <div
          className='flex items-center justify-center h-7 w-7 rounded-md shrink-0'
          style={{ backgroundColor: itemType ? `${itemType.color}20` : undefined }}
        >
          {Icon && <Icon className='h-3.5 w-3.5' style={{ color: itemType?.color }} />}
        </div>
        {item.isFavorite && <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />}
      </div>
      <p className='mt-2 font-medium text-sm leading-snug line-clamp-2'>{item.title}</p>
      {item.description && (
        <p className='mt-1 text-xs text-muted-foreground line-clamp-2'>{item.description}</p>
      )}
      <div className='mt-auto pt-2 flex items-end justify-between gap-2'>
        {item.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {item.tags.slice(0, 2).map(tag => (
              <span key={tag} className='px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground'>
                {tag}
              </span>
            ))}
          </div>
        )}
        <span className='text-[10px] text-muted-foreground shrink-0 ml-auto'>{date}</span>
      </div>
    </div>
  );
}

export default function PinnedItems() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const total = allPinned.length;

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCurrent(api.selectedScrollSnap());
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on('select', update);
    api.on('reInit', update);
  }, [api]);

  if (total === 0) return null;

  return (
    <section>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <Pin className='h-3.5 w-3.5 fill-white text-white' />
          <h2 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>Pinned</h2>
        </div>
        <div className='flex items-center gap-1'>
          <button
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev}
            className={cn(
              'flex items-center justify-center h-7 w-7 rounded-md border border-border transition-colors',
              !canPrev ? 'opacity-30 cursor-not-allowed' : 'hover:bg-accent hover:text-foreground'
            )}
            aria-label='Previous'
          >
            <ChevronLeft className='h-4 w-4' />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            disabled={!canNext}
            className={cn(
              'flex items-center justify-center h-7 w-7 rounded-md border border-border transition-colors',
              !canNext ? 'opacity-30 cursor-not-allowed' : 'hover:bg-accent hover:text-foreground'
            )}
            aria-label='Next'
          >
            <ChevronRight className='h-4 w-4' />
          </button>
        </div>
      </div>

      <Carousel setApi={setApi} opts={{ align: 'start', loop: false }} className='w-full'>
        <CarouselContent className='-ml-3'>
          {allPinned.map((card, i) => (
            <CarouselItem key={i} className='pl-3 sm:basis-1/2 lg:basis-1/3'>
              <div className={cn('h-full rounded-lg transition-all duration-200', i === current ? 'ring-1 ring-white/50' : '')}>
                {card.kind === 'collection'
                  ? <CollectionCard col={card.data} />
                  : <ItemCard item={card.data} />}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {total > 1 && (
        <div className='flex justify-center gap-1.5 mt-3'>
          {allPinned.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-200',
                i === current ? 'w-4 bg-foreground' : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
