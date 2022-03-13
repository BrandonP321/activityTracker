import express from "express";
import { UserRoutes } from "@activitytracker/common/src/api/routes";
import { GetUserController, GetUserDashDataController, GetUserListsController } from "~Controllers/user.controllers";
import { authenticateJWT } from "~Middleware/authJWT.middleware";

const router = express.Router();

router.get(UserRoutes.GetUser(), authenticateJWT, GetUserController);
router.get(UserRoutes.GetUserDashData(), authenticateJWT, GetUserDashDataController);
router.get(UserRoutes.GetUserLists(), authenticateJWT, GetUserListsController);

export default router;