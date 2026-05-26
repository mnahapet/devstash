-- Drop redundant single-column index on items.userId (replaced by composite below)
DROP INDEX "items_userId_idx";

-- Drop unused index on items.createdAt (no query sorts by createdAt)
DROP INDEX "items_createdAt_idx";

-- Drop single-column index on collections.userId (replaced by composite below)
DROP INDEX "collections_userId_idx";

-- CreateIndex: covers WHERE userId = ? ORDER BY updatedAt DESC on items
CREATE INDEX "items_userId_updatedAt_idx" ON "items"("userId", "updatedAt" DESC);

-- CreateIndex: covers WHERE userId = ? ORDER BY updatedAt DESC on collections
CREATE INDEX "collections_userId_updatedAt_idx" ON "collections"("userId", "updatedAt" DESC);
