'use client';

import { useState, useEffect, useMemo } from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CollectionWithStats } from '@/lib/db/collections';
import type { ItemWithType } from '@/lib/db/items';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { CollectionCarouselCard, ItemCarouselCard } from '@/components/dashboard/shared/carousel-cards';
import type { CarouselCard } from '@/types/dashboard';

interface Props {
  recentCollections: CollectionWithStats[];
  recentItems: ItemWithType[];
}

export default function RecentCarousel({ recentCollections, recentItems }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const allRecent = useMemo<CarouselCard[]>(() => [
    ...recentCollections.map(c => ({ kind: 'collection' as const, data: c })),
    ...recentItems.map(i => ({ kind: 'item' as const, data: i })),
  ], [recentCollections, recentItems]);
  const total = allRecent.length;

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
    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);

  if (total === 0) return null;

  return (
    <section aria-labelledby='recent-heading'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <Clock className='h-3.5 w-3.5 text-muted-foreground' />
          <h2 id='recent-heading' className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>Recent</h2>
        </div>
        <div className='flex items-center gap-1'>
          <button
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev}
            className={cn(
              'flex items-center justify-center h-7 w-7 rounded-md border border-border transition-colors',
              !canPrev ? 'opacity-30 cursor-not-allowed' : 'hover:bg-accent hover:text-foreground'
            )}
            aria-label='Previous recent item'
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
            aria-label='Next recent item'
          >
            <ChevronRight className='h-4 w-4' />
          </button>
        </div>
      </div>

      <Carousel setApi={setApi} opts={{ align: 'start', loop: false }} className='w-full'>
        <CarouselContent className='-ml-3'>
          {allRecent.map((card, i) => (
            <CarouselItem key={`${card.kind}-${card.data.id}`} className='pl-3 sm:basis-1/2 lg:basis-1/3'>
              <div className={cn('h-full rounded-lg transition-all duration-200', i === current ? 'ring-1 ring-foreground/20' : '')}>
                {card.kind === 'collection'
                  ? <CollectionCarouselCard col={card.data} />
                  : <ItemCarouselCard item={card.data} />}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {total > 1 && (
        <div className='flex justify-center gap-1.5 mt-3'>
          {allRecent.map((card, i) => (
            <button
              key={`dot-${card.kind}-${card.data.id}`}
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
