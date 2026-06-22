import { Router, type IRouter } from "express";
import healthRouter from "./health";
import waitlistRouter from "./waitlist";
import walletsRouter from "./wallets";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(waitlistRouter);
router.use(walletsRouter);
router.use(statsRouter);

export default router;
