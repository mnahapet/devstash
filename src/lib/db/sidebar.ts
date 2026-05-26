import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { SidebarCollection, SidebarItem } from '@/types/sidebar';

const collectionSelect = {
  id: true,
  name: true,
  items: {
    select: {
      item: {
        select: {
          itemTypeId: true,
          itemType: { select: { color: true } },
        },
      },
    },
  },
} as const;

const itemSelect = {
  id: true,
  title: true,
  itemType: { select: { icon: true, color: true } },
} as const;

function toSidebarCollection(col: {
  id: string;
  name: string;
  items: { item: { itemTypeId: string; itemType: { color: string } } }[];
}): SidebarCollection {
  const typeCounts = new Map<string, { color: string; count: number }>();
  for (const { item } of col.items) {
    const entry = typeCounts.get(item.itemTypeId);
    if (entry) {
      entry.count++;
    } else {
      typeCounts.set(item.itemTypeId, { color: item.itemType.color, count: 1 });
    }
  }
  return {
    id: col.id,
    name: col.name,
    itemCount: col.items.length,
    typeDistribution: Array.from(typeCounts.values()),
  };
}

export type SidebarData = {
  pinnedCollections: SidebarCollection[];
  favoriteCollections: SidebarCollection[];
  recentCollections: SidebarCollection[];
  pinnedItems: SidebarItem[];
  favoriteItems: SidebarItem[];
  recentItems: SidebarItem[];
};

export const getSidebarData = cache(async (userId: string): Promise<SidebarData> => {
  const [
    pinnedCollRaw,
    favCollRaw,
    recentCollRaw,
    pinnedItemsRaw,
    favItemsRaw,
    recentItemsRaw,
  ] = await Promise.all([
    prisma.collection.findMany({
      where: { userId, isPinned: true },
      orderBy: { updatedAt: 'desc' },
      take: 1,
      select: collectionSelect,
    }),
    prisma.collection.findMany({
      where: { userId, isFavorite: true },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select: collectionSelect,
    }),
    prisma.collection.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select: collectionSelect,
    }),
    prisma.item.findMany({
      where: { userId, isPinned: true },
      orderBy: { updatedAt: 'desc' },
      take: 1,
      select: itemSelect,
    }),
    prisma.item.findMany({
      where: { userId, isFavorite: true },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select: itemSelect,
    }),
    prisma.item.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select: itemSelect,
    }),
  ]);

  return {
    pinnedCollections: pinnedCollRaw.map(toSidebarCollection),
    favoriteCollections: favCollRaw.map(toSidebarCollection),
    recentCollections: recentCollRaw.map(toSidebarCollection),
    pinnedItems: pinnedItemsRaw,
    favoriteItems: favItemsRaw,
    recentItems: recentItemsRaw,
  };
});
