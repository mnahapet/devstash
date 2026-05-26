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

const ITEM_SELECT = {
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
} as const;

type RawItem = {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  itemType: { id: string; name: string; icon: string; color: string };
  tags: { id: string; name: string }[];
  collections: { collection: { isFavorite: boolean } }[];
};

function toItemWithType({ collections, ...item }: RawItem): ItemWithType {
  return {
    ...item,
    inFavoriteCollection: collections.some(ic => ic.collection.isFavorite),
  };
}

export const getItemStats = cache(async (userId: string): Promise<ItemStats> => {
  const [total, favorites] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
  ]);
  return { total, favorites };
});

export const getItems = cache(async (
  userId: string,
  page = 1,
  pageSize = 6,
): Promise<ItemWithType[]> => {
  const rows = await prisma.item.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: ITEM_SELECT,
  });
  return rows.map(toItemWithType);
});

export const getPinnedItems = cache(async (userId: string): Promise<ItemWithType[]> => {
  const rows = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { updatedAt: 'desc' },
    take: 10,
    select: ITEM_SELECT,
  });
  return rows.map(toItemWithType);
});

export const getFavoriteItems = cache(async (userId: string): Promise<ItemWithType[]> => {
  const rows = await prisma.item.findMany({
    where: { userId, isFavorite: true },
    orderBy: { updatedAt: 'desc' },
    take: 10,
    select: ITEM_SELECT,
  });
  return rows.map(toItemWithType);
});

export const getRecentItems = cache(async (userId: string): Promise<ItemWithType[]> => {
  const rows = await prisma.item.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 3,
    select: ITEM_SELECT,
  });
  return rows.map(toItemWithType);
});
