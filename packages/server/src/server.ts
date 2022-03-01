import dotenv from "dotenv";
import { EnvUtils, EnvVars } from "@activitytracker/common/src/utils/EnvUtils";
import express from "express";

// .env must be configured before importing other modules that use .env
dotenv.config({ path: EnvUtils.getEnvFilePath() ?? "../.env" });

import { createServer } from "http"
import { connectToMongoDb } from "~Models";
import { configureApp } from "~Middleware/appConfiguration";
import { configureRoutes } from "./routes";

const PORT = EnvUtils.getEnvVar(EnvVars.PORT, "8000");

export const app = express();
const httpServer = createServer(app);

// MIDDLEWARE
configureApp(app);

// ROUTES
configureRoutes(app);

// DB CONNECTION
connectToMongoDb();

httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})