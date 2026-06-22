import { Router } from "express";
import { db, waitlistTable, walletsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/stats", async (_req, res) => {
  const [[{ waitlistCount }], [{ totalWallets }]] = await Promise.all([
    db.select({ waitlistCount: sql<number>`cast(count(*) as int)` }).from(waitlistTable),
    db.select({ totalWallets: sql<number>`cast(count(*) as int)` }).from(walletsTable),
  ]);

  const uniqueHolders = await db
    .selectDistinct({ userId: walletsTable.userId })
    .from(walletsTable);

  res.json({
    totalHolders: uniqueHolders.length,
    totalWallets,
    waitlistCount,
    roadmapProgress: 35,
    currentPhase: "Phase 2 — Berry Patch",
  });
});

export default router;
