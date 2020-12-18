import { Router } from "express";
import cors from "cors";
import quareController from "../../controllers/v1/square-controller";
import { corsOptionsDelegate, isAuth } from "../../middlewares/auth";

const router = Router();

router.post(
  "/get-square",
  cors(corsOptionsDelegate),
  isAuth,
  quareController.getSquareInfo
);
router.post(
  "/create-square",
  cors(corsOptionsDelegate),
  isAuth,
  quareController.createSquare
);
export default router;
