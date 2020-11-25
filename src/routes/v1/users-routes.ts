import { Router } from "express";
import cors from "cors";
import userController from "../../controllers/v1/users-controller";
import { corsOptionsDelegate, isAuth } from "../../middlewares/auth";

const router = Router();

router.post("/login", userController.login);
router.post(
  "/create",
  // cors(corsOptionsDelegate),
  isAuth,
  userController.createUser
);
router.post(
  "/update",
  // cors(corsOptionsDelegate),
  isAuth,
  userController.updateUser
);
router.post(
  "/delete",
  // cors(corsOptionsDelegate),
  isAuth,
  userController.deleteUser
);
router.get(
  "/get-all",
  // cors(corsOptionsDelegate),
  isAuth,
  userController.getUsers
);

export default router;
