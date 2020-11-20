import { Router } from "express";
import { isValidHost, isAuth } from "../../middlewares/auth";
import userController from "../../controllers/v1/users-controller";

const router = Router();

router.post("/login", isValidHost, userController.login);
router.post("/create", isValidHost, isAuth, userController.createUser);
router.post("/update", isValidHost, isAuth, userController.updateUser);
router.post("/delete", isValidHost, isAuth, userController.deleteUser);
router.get("/get-all", isValidHost, isAuth, userController.getUsers);

export default router;
