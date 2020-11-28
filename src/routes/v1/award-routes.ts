import { Router } from "express";
import cors from "cors";
import { corsOptionsDelegate, isAuth } from "../../middlewares/auth";
import awardController from "../../controllers/v1/award-controller";

const router = Router();

router.post(
  "/create",
  cors(corsOptionsDelegate),
  isAuth,
  awardController.createAward
);
router.post(
  "/update",
  cors(corsOptionsDelegate),
  isAuth,
  awardController.updateAward
);
router.post(
  "/delete",
  cors(corsOptionsDelegate),
  isAuth,
  awardController.deleteAward
);
router.get("/get-all", isAuth, awardController.getAwards);

export default router;
