import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export type ItemWithType = {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  inFavoriteCollection: boolean;
  itemType: { id: string; name: string; icon: string; color: string };
  tags: { id: string; name: string }[];
  createdAt: Date;
  updatedAt: Date;
};

export type ItemStats = {
  total: number;
  favorites: number;
};

export const getItems = cache(async (userId: string): Promise<ItemWithType[]> => {
  const rows = await prisma.item.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      isFavorite: true,
      isPinned: true,
      createdAt: true,
      updatedAt: true,
      itemType: {
        select: { id: true, name: true, icon: true, color: true },
      },
      tags: {
        select: { id: true, name: true },
      },
      collections: {
        select: {
          collection: { select: { isFavorite: true } },
        },
      },
    },
  });

  return rows.map(({ collections, ...item }) => ({
    ...item,
    inFavoriteCollection: collections.some(ic => ic.collection.isFavorite),
  }));
});

export function deriveItemStats(items: ItemWithType[]): ItemStats {
  return {
    total: items.length,
    favorites: items.filter(i => i.isFavorite).length,
  };
}
