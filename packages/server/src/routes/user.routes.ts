import express from "express";
import { Routes } from "@activitytracker/common/src/api/routes";
import { GetUserController } from "~Controllers/user.controllers";
import { authenticateJWT } from "~Middleware/authJWT.middleware";

const router = express.Router();

router.get(Routes.GetUser(), authenticateJWT, GetUserController);

export default router;