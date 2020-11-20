import { Router } from "express";
import { isValidHost, isAuth } from "../../middlewares/auth";
import loteryController from "../../controllers/v1/lotery-controller";

const router = Router();

router.post("/create", isValidHost, isAuth, loteryController.createLotery);
router.post("/update", isValidHost, isAuth, loteryController.updateLotery);
router.post("/delete", isValidHost, isAuth, loteryController.deleteLotery);
router.get("/get-all", isValidHost, isAuth, loteryController.getLoteries);

export default router;
