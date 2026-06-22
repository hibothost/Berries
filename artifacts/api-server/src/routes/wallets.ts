import { Router } from "express";
import { db, walletsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { z } from "zod";

const router = Router();

const connectWalletBody = z.object({
  address: z.string().min(1),
  provider: z.string().min(1),
});

router.post("/wallets", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = connectWalletBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid wallet data" });
    return;
  }

  const { address, provider } = parsed.data;

  const existing = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.userId, userId), eq(walletsTable.address, address)))
    .limit(1);

  if (existing.length > 0) {
    res.status(201).json(existing[0]);
    return;
  }

  const [wallet] = await db
    .insert(walletsTable)
    .values({ address, provider, userId })
    .returning();

  res.status(201).json(wallet);
});

router.get("/wallets", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const wallets = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.userId, userId));

  res.json(wallets);
});

export default router;
