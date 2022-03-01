/**
 * Generic middleware that would normally be defined in server.ts
 */
 import express, { Express } from "express";
 import cors from "cors";
 import helmet from "helmet";
 import expressMongoSanitize from "express-mongo-sanitize";
 
 export const configureApp = (app: Express) => {
     app.use(helmet());
 
     app.use(cors({
         // origin
         // exposedHeaders: "auth-token"
     }));
 
     app.use(express.urlencoded({ extended: true }));
     app.use(express.json());
 
     app.use(expressMongoSanitize());
 }