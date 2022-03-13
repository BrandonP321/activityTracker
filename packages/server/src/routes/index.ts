import { Express } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import activityRoutes from "./activity.routes";
import listRoutes from "./list.routes";

export const configureRoutes = (app: Express) => {
    app.use(authRoutes);
    app.use(userRoutes);
    app.use(activityRoutes);
    app.use(listRoutes);
}