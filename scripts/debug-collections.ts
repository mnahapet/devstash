import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'demo@devstash.io' },
    select: { id: true },
  });
  console.log('userId:', user?.id);

  const itemCollectionCount = await prisma.itemCollection.count();
  console.log('Total itemCollections:', itemCollectionCount);

  const col = await prisma.collection.findFirst({
    where: { userId: user?.id },
    include: {
      items: {
        include: {
          item: {
            select: {
              itemTypeId: true,
              itemType: { select: { id: true, color: true, icon: true } },
            },
          },
        },
      },
    },
  });

  console.log('\nFirst collection:', col?.name);
  console.log('Items in collection:', col?.items.length);
  if (col?.items[0]) {
    console.log('Sample item type:', JSON.stringify(col.items[0].item.itemType));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
