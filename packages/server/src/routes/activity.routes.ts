import express from "express";
import { ActivityRoutes } from "@activitytracker/common/src/api/routes";
import { CreateActivityController, GetUserActivitiesController } from "~Controllers/activity.controllers";
import { authenticateJWT } from "~Middleware/authJWT.middleware";

const router = express.Router();

router.get(ActivityRoutes.GetUserActivities(), authenticateJWT, GetUserActivitiesController);

router.post(ActivityRoutes.CreateActivity(), authenticateJWT, CreateActivityController);

export default router;