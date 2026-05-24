import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const favoriteIds = [
    'seed-collection-react',
    'seed-collection-devops',
    'seed-collection-nextjs',
    'seed-collection-vscode',
  ];

  const result = await prisma.collection.updateMany({
    where: { id: { in: favoriteIds } },
    data: { isFavorite: true },
  });

  console.log(`Marked ${result.count} collections as favorite.`);

  const favorites = await prisma.collection.findMany({
    where: { isFavorite: true },
    select: { id: true, name: true, isFavorite: true },
  });

  console.log('All favorite collections:');
  favorites.forEach(c => console.log(` - ${c.name} (${c.id})`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
