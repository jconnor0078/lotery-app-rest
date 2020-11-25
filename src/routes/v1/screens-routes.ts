import { Router } from "express";
import cors from 'cors';
import screensController from "../../controllers/v1/screens-controller";
import { corsOptionsDelegate, isAuth } from "../../middlewares/auth";

const router = Router();
router.get(
  "/get-screen/:screenId",
  cors(corsOptionsDelegate),
  isAuth,
  screensController.getDataForScreen
);

export default router;
