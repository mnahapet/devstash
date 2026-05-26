import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export type CollectionWithStats = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  hasFavoriteItem: boolean;
  itemCount: number;
  typeDistribution: { typeId: string; color: string; icon: string; count: number }[];
  createdAt: Date;
  updatedAt: Date;
};

export type CollectionStats = {
  total: number;
  favorites: number;
};

const COLLECTION_INCLUDE = {
  items: {
    include: {
      item: {
        select: {
          itemTypeId: true,
          isFavorite: true,
          itemType: { select: { id: true, color: true, icon: true } },
        },
      },
    },
  },
} as const;

type RawCollection = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: {
    item: {
      itemTypeId: string;
      isFavorite: boolean;
      itemType: { id: string; color: string; icon: string };
    };
  }[];
};

function toCollectionWithStats(col: RawCollection): CollectionWithStats {
  const typeCounts = new Map<string, { color: string; icon: string; count: number }>();
  let hasFavoriteItem = false;

  for (const { item } of col.items) {
    if (item.isFavorite) hasFavoriteItem = true;
    const entry = typeCounts.get(item.itemTypeId);
    if (entry) {
      entry.count++;
    } else {
      typeCounts.set(item.itemTypeId, { color: item.itemType.color, icon: item.itemType.icon, count: 1 });
    }
  }

  return {
    id: col.id,
    name: col.name,
    description: col.description,
    isFavorite: col.isFavorite,
    isPinned: col.isPinned,
    hasFavoriteItem,
    itemCount: col.items.length,
    typeDistribution: Array.from(typeCounts.entries()).map(([typeId, data]) => ({ typeId, ...data })),
    createdAt: col.createdAt,
    updatedAt: col.updatedAt,
  };
}

export const getCollectionStats = cache(async (userId: string): Promise<CollectionStats> => {
  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: { userId } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);
  return { total, favorites };
});

export const getCollections = cache(async (
  userId: string,
  page = 1,
  pageSize = 6,
): Promise<CollectionWithStats[]> => {
  const rows = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: COLLECTION_INCLUDE,
  });
  return rows.map(toCollectionWithStats);
});

export const getPinnedCollections = cache(async (userId: string): Promise<CollectionWithStats[]> => {
  const rows = await prisma.collection.findMany({
    where: { userId, isPinned: true },
    orderBy: { updatedAt: 'desc' },
    take: 10,
    include: COLLECTION_INCLUDE,
  });
  return rows.map(toCollectionWithStats);
});

export const getFavoriteCollections = cache(async (userId: string): Promise<CollectionWithStats[]> => {
  const rows = await prisma.collection.findMany({
    where: { userId, isFavorite: true },
    orderBy: { updatedAt: 'desc' },
    take: 10,
    include: COLLECTION_INCLUDE,
  });
  return rows.map(toCollectionWithStats);
});

export const getRecentCollections = cache(async (userId: string): Promise<CollectionWithStats[]> => {
  const rows = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 3,
    include: COLLECTION_INCLUDE,
  });
  return rows.map(toCollectionWithStats);
});
