import { JWTUtils } from "~Utils/JWTUtils";
import { RouteMiddleware } from ".";
import { NextFunction, Request, Response } from "express";
import mongoose, { NativeError } from "mongoose";
import { ControllerUtils, MongooseUtils } from "~Utils";
import bcrypt from "bcrypt";
import db from "~Models";
import { IUserDocument } from "@activitytracker/common/src/api/models/User.d";
import { BaseRequestErrors } from "@activitytracker/common/src/api/requests";
import { ConfigUtils } from "@activitytracker/common/src/utils/ConfigUtils";
import { MasterConfig } from "@activitytracker/common/src/config";
import { EnvUtils, ServerEnvVars } from "@activitytracker/common/src/utils/EnvUtils";

// other properties that will exist in Request object
export interface IAuthJWTResLocals {
    user: {
        id: mongoose.Types.ObjectId;
    }
}

/* middleware function to authenticate user via a jwt sent in a cookie with the request */
export const authenticateJWT: RouteMiddleware<{ UrlParams: {}, ReqBody: {}, ResBody: {} }, IAuthJWTResLocals> = (req, res, next) => {    
    const { accessToken, refreshToken } = JWTUtils.getTokenFromCookie(req) ?? {}

    if (accessToken && refreshToken) {
        const atoken = JWTUtils.verifyAccessToken(accessToken);

        // if no token was verified or decoded, have user reauth
        if (!atoken || !atoken.userId || !atoken.jwtHash) {
            return haveUserReAuth(res);
        }

        // verify token has valid credentials if it is expired, then refresh tokens if valid
        if (atoken.isExpired) {
            return verifyTokenHash(atoken.userId, atoken.jwtHash, req, res, next);
        }

        const userId = MongooseUtils.idStringToMongooseId(atoken.userId);

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

/* send error to client to have user re-auth */
export const haveUserReAuth = (res: Response) => ControllerUtils.respondWithErr(BaseRequestErrors.UserMustReAuth({}), res)

/* validate access token and refresh access and refresh tokens if valid */
const verifyTokenHash = (userId: string, hash: string,req: Request, res: Response, next: NextFunction) => {
    let id: mongoose.Types.ObjectId;

    try {
        id = new mongoose.Types.ObjectId(userId);
    } catch (err) {
        return haveUserReAuth(res);
    }

    db.User.findById(id, (err: any, user: IUserDocument) => {
        if (err) {
            return haveUserReAuth(res);
        }

        // if hash on jwt and hash in user db instance match, have client make request to refresh tokens
        if (user.jwtHash && (user.jwtHash === hash)) {
            return refreshTokens(req, res, id, next);
        } else {
            return haveUserReAuth(res);
        }
    })
}

/* generate new jwt's and void current refresh token */
const refreshTokens = async (req: Request, res: Response, userId: mongoose.Types.ObjectId, next: NextFunction) => {
    const tokenHash = await generateRandomHash();

    db.User.findOneAndUpdate({ _id: userId }, { $set: { jwtHash: tokenHash } }, async (err: NativeError, user: IUserDocument) => {
        if (err || !user) {
            return haveUserReAuth(res);
        }

        try {
            createTokenCookies(user, tokenHash, res);
        } catch (err) {
            return haveUserReAuth(res);
        }

        res.locals.user = { id: userId }

        next();
    })
}

const JWTExpirationTime = ConfigUtils.getParam(MasterConfig.JWTSettings.AccessTokenExpirationTime, "1000")

export const createTokenCookies = (user: IUserDocument, hash: string, res: Response) => {
    const accessToken = user.generateAccessToken(hash, JWTExpirationTime);
    const refreshToken = user.generateRefreshToken(hash);

    const tokens = {
        accessToken, refreshToken
    }

    // create cookie for tokens with no expiration to keep user always signed in until they clear their cookies
    res.cookie("siteTokens", JSON.stringify(tokens), {
        // forces use of https in production
        secure: !EnvUtils.isLocal,
        // makes tokens inaccessible in client's javascript
        httpOnly: true,
    })

    return tokens;
}

const SECRET = EnvUtils.getEnvVar(ServerEnvVars.SECRET, "");

export const generateRandomHash = async () => {
    return await bcrypt.hash(SECRET, 10)
}