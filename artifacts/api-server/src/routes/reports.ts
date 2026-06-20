import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/api/reports", (_req, res) => {
  res.json({
    stub: true,
    reports: [],
    message: "Phase 4: load saved reports from Postgres",
  });
});

router.post("/api/reports", (req, res) => {
  const report = req.body?.report ?? null;
  res.status(201).json({
    stub: true,
    saved: true,
    report,
    message: "Phase 4: persist report to database",
  });
});

export default router;
