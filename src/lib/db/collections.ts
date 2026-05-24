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

export async function getCollections(userId: string): Promise<CollectionWithStats[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
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
    },
  });

  return collections.map((col) => {
    const typeCounts = new Map<string, { color: string; icon: string; count: number }>();
    let hasFavoriteItem = false;

    for (const { item } of col.items) {
      if (item.isFavorite) hasFavoriteItem = true;
      const entry = typeCounts.get(item.itemTypeId);
      if (entry) {
        entry.count++;
      } else {
        typeCounts.set(item.itemTypeId, {
          color: item.itemType.color,
          icon: item.itemType.icon,
          count: 1,
        });
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
      typeDistribution: Array.from(typeCounts.entries()).map(([typeId, data]) => ({
        typeId,
        ...data,
      })),
      createdAt: col.createdAt,
      updatedAt: col.updatedAt,
    };
  });
}

export async function getCollectionStats(userId: string): Promise<CollectionStats> {
  const [total, favorites] = await prisma.$transaction([
    prisma.collection.count({ where: { userId } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);
  return { total, favorites };
}
