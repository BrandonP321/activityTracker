import express from "express";
import { ListRoutes } from "@activitytracker/common/src/api/routes";
import { authenticateJWT } from "~Middleware/authJWT.middleware";
import { AddActivityToListController, CreateListController, GetListController } from "~Controllers/list.controllers";

const router = express.Router();

router.get(ListRoutes.GetList(), authenticateJWT, GetListController)

router.post(ListRoutes.CreateList(), authenticateJWT, CreateListController);

router.put(ListRoutes.AddActivityToList(), authenticateJWT, AddActivityToListController);

export default router;