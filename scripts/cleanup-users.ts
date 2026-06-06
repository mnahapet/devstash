import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

const DEMO_EMAIL = 'demo@devstash.io';

async function main() {
  const targets = await prisma.user.findMany({
    where: { email: { not: DEMO_EMAIL } },
    select: { id: true, email: true },
  });

  if (targets.length === 0) {
    console.log('No non-demo users found. Nothing to delete.');
    return;
  }

  console.log(`Found ${targets.length} user(s) to delete:`);
  targets.forEach(u => console.log(`  - ${u.email} (${u.id})`));

  const ids = targets.map(u => u.id);

  // Delete in dependency order
  const tags = await prisma.item.findMany({
    where: { userId: { in: ids } },
    select: { id: true },
  });
  const itemIds = tags.map(i => i.id);

  await prisma.itemCollection.deleteMany({ where: { itemId: { in: itemIds } } });
  await prisma.item.deleteMany({ where: { userId: { in: ids } } });
  await prisma.collection.deleteMany({ where: { userId: { in: ids } } });
  await prisma.itemType.deleteMany({ where: { userId: { in: ids } } });
  await prisma.verificationToken.deleteMany({ where: { identifier: { in: targets.map(u => u.email) } } });
  await prisma.session.deleteMany({ where: { userId: { in: ids } } });
  await prisma.account.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });

  console.log(`Deleted ${targets.length} user(s) and all their content.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
