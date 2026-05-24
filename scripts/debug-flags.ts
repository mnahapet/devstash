import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const cols = await prisma.collection.findMany({
    select: { id: true, name: true, isFavorite: true, isPinned: true },
    orderBy: { name: 'asc' },
  });

  console.log('Collections:');
  cols.forEach(c =>
    console.log(`  ${c.name.padEnd(25)} isFavorite=${c.isFavorite} isPinned=${c.isPinned}`)
  );

  const items = await prisma.item.findMany({
    where: { isFavorite: true },
    select: { id: true, title: true, isFavorite: true },
  });
  console.log(`\nFavorite items (${items.length}):`);
  items.forEach(i => console.log(`  ${i.id}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
