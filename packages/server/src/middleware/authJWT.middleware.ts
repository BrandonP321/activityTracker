import { JWTUtils } from "~Utils/JWTUtils";
import { RouteMiddleware } from ".";
import { Response } from "express";
import mongoose from "mongoose";
import { ControllerUtils, MongooseUtils } from "~Utils"
import { ClientErrorStatusCodes } from "@activitytracker/common/src/api/requests/statusCodes";
import { RequestErrors } from "@activitytracker/common/src/api/requests/RequestErrors";
import db from "~Models";
import { IUserDocument } from "@activitytracker/common/src/api/models/User.d";

// other properties that will exist in Request object
export interface IAuthJWTResLocals {
    user: {
        id: mongoose.Types.ObjectId;
    }
}

export const authenticateJWT: RouteMiddleware<{ UrlParams: {}, ReqBody: {}, ResBody: {} }, IAuthJWTResLocals> = (req, res, next) => {
    const tokenFromHeader = JWTUtils.getTokenFromHeader(req);
    if (tokenFromHeader) {
        const token = JWTUtils.verifyAccessToken(tokenFromHeader);

        // if no token was verified or decoded, have user reauth
        if (!token || !token.userId || !token.jwtHash) {
            return haveUserReAuth(res);
        }

        // verify token has valid credentials if it is expired
        if (token.isExpired) {
            return verifyTokenHash(token.userId, token.jwtHash, () => haveUserReAuth(res), () => haveClientSendRefreshToken(res));
        }

        const userId = MongooseUtils.idStringToMongooseId(token.userId);

        if (!userId) {
            return haveUserReAuth(res);
        }

        res.locals.user = { id: userId }
        
        next();
    } else {
        // if no token was sent in the request, have user reauth
        return haveUserReAuth(res);
    }
}

// tells client to have user reauth
export const haveUserReAuth = (res: Response) => ControllerUtils.respondWithErr({
    status: ClientErrorStatusCodes.Unauthorized,
    data: { error: RequestErrors.UserMustReAuth }
}, res)

// tells client to send refresh token to attempt to refresh access token
export const haveClientSendRefreshToken = (res: Response) => ControllerUtils.respondWithErr({
    status: ClientErrorStatusCodes.Unauthorized,
    data: { error: RequestErrors.ExpiredAccessToken }
}, res)

const verifyTokenHash = (userId: string, hash: string, userReAuth: () => void, haveClientRefreshTokens: () => void) => {
    let id: mongoose.Types.ObjectId;

    try {
        id = new mongoose.Types.ObjectId(userId);
    } catch (err) {
        return userReAuth();
    }

    db.User.findById(id, (err: any, user: IUserDocument) => {
        if (err) {
            return userReAuth();
        }

        // if hash on jwt and hash in user db instance match, have client make request to refresh tokens
        if (user.jwtHash && (user.jwtHash === hash)) {
            return haveClientRefreshTokens();
        } else {
            return userReAuth();
        }
    })
}