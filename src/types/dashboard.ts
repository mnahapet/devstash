import type { CollectionWithStats } from '@/lib/db/collections';
import type { ItemWithType } from '@/lib/db/items';

export type CarouselCard =
  | { kind: 'collection'; data: CollectionWithStats }
  | { kind: 'item'; data: ItemWithType };
