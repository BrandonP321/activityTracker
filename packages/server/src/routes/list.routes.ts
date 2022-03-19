import express from "express";
import { ListRoutes } from "@activitytracker/common/src/api/routes";
import { authenticateJWT } from "~Middleware/authJWT.middleware";
import { AddActivityToListController, CreateListController } from "~Controllers/list.controllers";

const router = express.Router();

router.post(ListRoutes.CreateList(), authenticateJWT, CreateListController);

router.put(ListRoutes.AddActivityToList(), authenticateJWT, AddActivityToListController);

export default router;