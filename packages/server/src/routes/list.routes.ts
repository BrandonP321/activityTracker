import express from "express";
import { ListRoutes } from "@activitytracker/common/src/api/routes";
import { authenticateJWT } from "~Middleware/authJWT.middleware";
import { CreateListController } from "~Controllers/list.controllers";

const router = express.Router();

router.post(ListRoutes.CreateList(), authenticateJWT, CreateListController);

export default router;