import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  // Mark some items as favorite
  const favoriteItemIds = [
    'seed-item-react-1',
    'seed-item-react-2',
    'seed-item-ai-1',
    'seed-item-next-1',
    'seed-item-vscode-2',
    'seed-item-terminal-1',
  ];

  const itemResult = await prisma.item.updateMany({
    where: { id: { in: favoriteItemIds } },
    data: { isFavorite: true },
  });
  console.log(`Marked ${itemResult.count} items as favorite.`);

  // Mark some collections as pinned
  const pinnedCollectionIds = [
    'seed-collection-react',
    'seed-collection-nextjs',
  ];

  const collectionResult = await prisma.collection.updateMany({
    where: { id: { in: pinnedCollectionIds } },
    data: { isPinned: true },
  });
  console.log(`Marked ${collectionResult.count} collections as pinned.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
