import { Router, type IRouter } from "express";
import healthRouter from "./health";
import weatherRouter from "./weather";
import workspaceRouter from "./workspace";
import reportsRouter from "./reports";

const router: IRouter = Router();

router.use(healthRouter);
router.use(weatherRouter);
router.use(workspaceRouter);
router.use(reportsRouter);

export default router;