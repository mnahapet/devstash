'use client';

import { useState, useEffect, useMemo } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const allFavorites = useMemo<FavoriteCard[]>(() => [
    ...favoriteCollections.map(c => ({ kind: 'collection' as const, data: c })),
    ...favoriteItems.map(i => ({ kind: 'item' as const, data: i })),
  ], [favoriteCollections, favoriteItems]);
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
          <Star className='h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />
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
            <CarouselItem key={`${card.kind}-${card.data.id}`} className='pl-3 sm:basis-1/2 lg:basis-1/3'>
              <div className={cn('h-full rounded-lg transition-all duration-200', i === current ? 'ring-1 ring-foreground/20' : '')}>
                {card.kind === 'collection'
                  ? <CollectionCarouselCard col={card.data} showHeart={false} />
                  : <ItemCarouselCard item={card.data} showHeart={false} />}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {total > 1 && (
        <div className='flex justify-center gap-1.5 mt-3'>
          {allFavorites.map((card, i) => (
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
