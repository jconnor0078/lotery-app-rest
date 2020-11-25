import { Router } from "express";
import cors from "cors";
import { corsOptionsDelegate, isAuth } from "../../middlewares/auth";
import loteryController from "../../controllers/v1/lotery-controller";

const router = Router();

router.post(
  "/create",
  // cors(corsOptionsDelegate),
  isAuth,
  loteryController.createLotery
);
router.post(
  "/update",
  // cors(corsOptionsDelegate),
  isAuth,
  loteryController.updateLotery
);
router.post(
  "/delete",
  //  cors(corsOptionsDelegate),
  isAuth,
  loteryController.deleteLotery
);
router.get("/get-all", isAuth, loteryController.getLoteries);

export default router;
