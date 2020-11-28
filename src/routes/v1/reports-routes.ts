import { Router } from "express";
import cors from "cors";
import { corsOptionsDelegate, isAuth } from "../../middlewares/auth";
import reportsController from "../../controllers/v1/reports-controller";

const router = Router();

router.post(
  "/sales-summary",
  cors(corsOptionsDelegate),
  isAuth,
  reportsController.salesSummaryReport
);
export default router;