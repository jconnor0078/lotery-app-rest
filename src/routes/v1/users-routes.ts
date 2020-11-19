import { Router } from "express";
import { isValidHost } from "../../middlewares/auth";
import userController from "../../controllers/v1/users-controller";

const router = Router();

router.post("/login", userController.login);
router.post("/create", userController.createUser);
router.post("/update", isValidHost, userController.updateUser);
router.post("/delete", isValidHost, userController.deleteUser);
router.get("/get-all", isValidHost, userController.getUsers);

export default router;
