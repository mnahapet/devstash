import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export type ItemTypeWithCount = {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
};

export const getItemTypesWithCounts = cache(async (userId: string): Promise<ItemTypeWithCount[]> => {
  const [types, counts] = await Promise.all([
    prisma.itemType.findMany({
      where: { isSystem: true },
      select: { id: true, name: true, icon: true, color: true },
    }),
    prisma.item.groupBy({
      by: ['itemTypeId'],
      where: { userId },
      _count: { id: true },
    }),
  ]);

  const countMap = new Map(counts.map(c => [c.itemTypeId, c._count.id]));

  return types.map(t => ({ ...t, count: countMap.get(t.id) ?? 0 }));
});
