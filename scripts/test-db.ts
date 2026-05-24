import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  // Connection check
  await prisma.$queryRaw`SELECT 1`;
  console.log("✓ Connected to Neon PostgreSQL\n");

  // System item types
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });
  console.log(`✓ System item types (${itemTypes.length}):`);
  for (const t of itemTypes) {
    console.log(`    ${t.color}  ${t.name} — icon: ${t.icon}`);
  }

  // Table counts
  const [users, items, collections, tags] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.collection.count(),
    prisma.tag.count(),
  ]);
  console.log("\n✓ Row counts:");
  console.log(`    users: ${users}`);
  console.log(`    items: ${items}`);
  console.log(`    collections: ${collections}`);
  console.log(`    tags: ${tags}`);

  // Demo user
  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
    select: { id: true, email: true, name: true, isPro: true, createdAt: true },
  });

  if (!demoUser) {
    console.log("\n✗ Demo user not found — run npm run db:seed first");
    return;
  }

  console.log(`\n✓ Demo user:`);
  console.log(`    id:    ${demoUser.id}`);
  console.log(`    email: ${demoUser.email}`);
  console.log(`    name:  ${demoUser.name}`);
  console.log(`    isPro: ${demoUser.isPro}`);

  // Demo user collections with item counts
  const userCollections = await prisma.collection.findMany({
    where: { userId: demoUser.id },
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { items: true } },
      defaultType: { select: { name: true, color: true } },
    },
  });

  console.log(`\n✓ Collections (${userCollections.length}):`);
  for (const c of userCollections) {
    const defaultType = c.defaultType
      ? ` [default: ${c.defaultType.name}]`
      : "";
    console.log(
      `    • ${c.name} — ${c._count.items} item(s)${defaultType}`
    );
  }

  // Demo user items grouped by type
  const userItems = await prisma.item.findMany({
    where: { userId: demoUser.id },
    orderBy: [{ itemType: { name: "asc" } }, { createdAt: "asc" }],
    include: {
      itemType: { select: { name: true, color: true } },
      collections: { include: { collection: { select: { name: true } } } },
    },
  });

  console.log(`\n✓ Items (${userItems.length}):`);
  for (const item of userItems) {
    const colNames = item.collections
      .map((ic) => ic.collection.name)
      .join(", ");
    const colLabel = colNames ? ` → [${colNames}]` : "";
    console.log(
      `    ${item.itemType.color}  [${item.itemType.name}] ${item.title}${colLabel}`
    );
  }

  console.log("\nAll checks passed.");
}

main()
  .catch((e) => {
    console.error("Database test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
