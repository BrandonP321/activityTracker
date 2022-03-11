import express from "express";
import { UserRoutes } from "@activitytracker/common/src/api/routes";
import { GetUserController, GetUserDashDataController } from "~Controllers/user.controllers";
import { authenticateJWT } from "~Middleware/authJWT.middleware";

const router = express.Router();

router.get(UserRoutes.GetUser(), authenticateJWT, GetUserController);
router.get(UserRoutes.GetUserDashData(), authenticateJWT, GetUserDashDataController);

export default router;