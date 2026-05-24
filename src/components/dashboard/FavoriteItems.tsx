'use client';

import { useState, useEffect } from 'react';
import {
  Heart, Star, Pin, ChevronLeft, ChevronRight,
  FolderOpen, Code, Sparkles, Terminal, StickyNote, File, Image,
  Link as LinkIcon, type LucideIcon,
} from 'lucide-react';
import type { CollectionWithStats } from '@/lib/db/collections';
import type { ItemWithType } from '@/lib/db/items';
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

function getDominantTypeColor(distribution: CollectionWithStats['typeDistribution']): string {
  if (!distribution.length) return 'currentColor';
  return distribution.reduce((max, d) => d.count > max.count ? d : max).color;
}

function buildGradient(distribution: CollectionWithStats['typeDistribution']): string {
  const total = distribution.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return 'transparent';
  let cumulative = 0;
  const stops: string[] = [];
  for (const { color, count } of distribution) {
    const start = (cumulative / total) * 100;
    cumulative += count;
    const end = (cumulative / total) * 100;
    stops.push(`${color} ${start}%`, `${color} ${end}%`);
  }
  return `linear-gradient(to bottom, ${stops.join(', ')})`;
}

function CollectionCard({ col }: { col: CollectionWithStats }) {
  const gradient = buildGradient(col.typeDistribution);

  return (
    <div className='group flex rounded-lg border border-border bg-card overflow-hidden hover:border-border/60 hover:bg-accent/20 transition-colors cursor-pointer h-full'>
      <div className='w-0.5 shrink-0' style={{ background: gradient }} />
      <div className='flex flex-col flex-1 p-4 min-w-0'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-1.5'>
            <FolderOpen className='h-4 w-4 shrink-0' style={{ color: getDominantTypeColor(col.typeDistribution) }} />
            <span className='text-xs text-muted-foreground'>{col.itemCount} items</span>
          </div>
          <div className='flex items-center gap-1 shrink-0'>
            {col.hasFavoriteItem && <Star className='h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />}
            {col.isPinned && <Pin className='h-3.5 w-3.5 fill-foreground text-foreground' />}
          </div>
        </div>
        <p className='mt-2 font-semibold text-sm line-clamp-2'>{col.name}</p>
        {col.description && (
          <p className='mt-2 text-xs text-muted-foreground line-clamp-2'>{col.description}</p>
        )}
        {col.typeDistribution.length > 0 && (
          <div className='flex items-center gap-2 mt-auto pt-3'>
            {col.typeDistribution.map(type => {
              const Icon = ICON_MAP[type.icon];
              return Icon ? <Icon key={type.typeId} className='h-3.5 w-3.5' style={{ color: type.color }} /> : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemCard({ item }: { item: ItemWithType }) {
  const Icon = ICON_MAP[item.itemType.icon] ?? null;
  const date = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

  return (
    <div
      className='flex flex-col rounded-lg border border-border bg-card p-3 hover:bg-accent/30 transition-colors cursor-pointer h-full'
      style={{ borderLeftWidth: '2px', borderLeftColor: item.itemType.color }}
    >
      <div className='flex items-start justify-between gap-2'>
        <div
          className='flex items-center justify-center h-5 w-5 rounded shrink-0'
          style={{ backgroundColor: `${item.itemType.color}20` }}
        >
          {Icon && <Icon className='h-3 w-3' style={{ color: item.itemType.color }} />}
        </div>
        <div className='flex items-center gap-1 shrink-0'>
          <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
          {item.isPinned && <Pin className='h-3 w-3 fill-foreground text-foreground' />}
        </div>
      </div>
      <p className='mt-2 font-medium text-sm leading-snug line-clamp-2'>{item.title}</p>
      {item.description && (
        <p className='mt-2 text-xs text-muted-foreground line-clamp-2'>{item.description}</p>
      )}
      <div className='mt-auto pt-3 flex items-end justify-between gap-2'>
        {item.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {item.tags.slice(0, 2).map(tag => (
              <span key={tag.id} className='px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors'>
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <span className='text-[10px] text-muted-foreground shrink-0 ml-auto'>{date}</span>
      </div>
    </div>
  );
}

type FavoriteCard =
  | { kind: 'collection'; data: CollectionWithStats }
  | { kind: 'item'; data: ItemWithType };

interface Props {
  favoriteCollections: CollectionWithStats[];
  favoriteItems: ItemWithType[];
}

export default function FavoriteItems({ favoriteCollections, favoriteItems }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const allFavorites: FavoriteCard[] = [
    ...favoriteCollections.map(c => ({ kind: 'collection' as const, data: c })),
    ...favoriteItems.map(i => ({ kind: 'item' as const, data: i })),
  ];
  const total = allFavorites.length;

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
          <Heart className='h-3.5 w-3.5 fill-pink-500 text-pink-500' />
          <h2 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>Favorites</h2>
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
          {allFavorites.map((card, i) => (
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
          {allFavorites.map((_, i) => (
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
