import { LoginUserController, RefreshTokensController, RegisterUserController } from "~Controllers/auth.controllers";
import express from "express";
import { authenticateJWT } from "~Middleware/authJWT.middleware";
import { Routes } from "@activitytracker/common/src/api/routes";

const router = express.Router();

router.post(Routes.RegisterUser(), RegisterUserController);
router.post(Routes.LoginUser(), LoginUserController);
router.post(Routes.RefreshTokens(), RefreshTokensController);

export default router;