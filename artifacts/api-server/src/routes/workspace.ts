import { Router, type IRouter } from "express";

const router: IRouter = Router();

const emptyWorkspace = {
  watchlist: [],
  activeHotelId: null,
  comparisonIds: [],
};

router.get("/api/workspace", (_req, res) => {
  res.json({
    stub: true,
    workspace: emptyWorkspace,
    message: "Phase 4: persist workspace to Postgres per user",
  });
});

router.put("/api/workspace", (req, res) => {
  res.json({
    stub: true,
    saved: true,
    workspace: req.body?.workspace ?? emptyWorkspace,
    message: "Phase 4: sync workspace with database",
  });
});

export default router;
