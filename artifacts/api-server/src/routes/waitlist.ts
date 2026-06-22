import { Router } from "express";
import { db, waitlistTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const joinWaitlistBody = z.object({ email: z.string().email() });

router.post("/waitlist", async (req, res) => {
  const parsed = joinWaitlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const { email } = parsed.data;

  const existing = await db
    .select()
    .from(waitlistTable)
    .where(eq(waitlistTable.email, email))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "Already on waitlist" });
    return;
  }

  const [member] = await db
    .insert(waitlistTable)
    .values({ email })
    .returning();

  res.status(201).json(member);
});

router.get("/waitlist/count", async (_req, res) => {
  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(waitlistTable);

  res.json({ count });
});

export default router;
