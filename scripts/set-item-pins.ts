import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const pinnedItemIds = [
    'seed-item-react-1',
    'seed-item-devops-2',
  ];

  const result = await prisma.item.updateMany({
    where: { id: { in: pinnedItemIds } },
    data: { isPinned: true },
  });
  console.log(`Marked ${result.count} items as pinned.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
