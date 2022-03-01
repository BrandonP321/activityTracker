import { ControllerUtils } from "~Utils/ControllerUtils";
import { LoginUserErrors, LoginUserErrResponse, LoginUserRequest, RefreshTokensRequest, RegisterUserErrors, RegisterUserErrResponse, RegisterUserRequest } from "@activitytracker/common/src/api/requests/auth.request.types";
import { HandleControllerErr } from "./errorHandlers/HandleControllerErr";
import db from "~Models"
import mongoose, { CallbackError, Mongoose, NativeError } from "mongoose";
import { IUser, IUserDocument } from "@activitytracker/common/src/api/models/User.d";
import { JWTUtils } from "~Utils/JWTUtils";
import { RouteController } from "./index";
import bcrypt from "bcrypt";
import { EnvUtils, EnvVars } from "@activitytracker/common/src/utils/EnvUtils";
import { AuthUtils } from "@activitytracker/common/src/utils/AuthUtils";
import { ClientErrorStatusCodes, ServerErrorStatusCodes } from "@activitytracker/common/src/api/requests/statusCodes";
import { IUserDocSaveErr } from "~Models/User/userMethods";
import { haveUserReAuth } from "~Middleware/authJWT.middleware";
import { ConfigUtils } from "@activitytracker/common/src/utils/ConfigUtils"
import { MasterConfig } from "@activitytracker/common/src/config"

const SECRET = EnvUtils.getEnvVar(EnvVars.SECRET, "");

export const RegisterUserController: RouteController<RegisterUserRequest, {}> = async (req, res) => {
    const { email, fullName, password, passwordReEnter, phone, username } = req.body;

    // validate input from user
    const inputErr = AuthUtils.validateRegistrationFields({ email, fullName, password, passwordReEnter, phone, username })

    if (inputErr) {
        return ControllerUtils.respondWithErr<RegisterUserErrResponse>({
            status: ClientErrorStatusCodes.Unauthorized,
            data: { error: RegisterUserErrors.InvalidUserInput, errMsg: inputErr.msg, field: inputErr.field }
        }, res)
    }

    // hash that will be used to enforce that a refresh token is only used once
    const newTokenHash = await generateRandomHash();

    const user: Partial<IUser> = {
        ...req.body,
        jwtHash: newTokenHash
    }

    db.User.create(user, async (err: CallbackError | IUserDocSaveErr, user) => {
        if (err && !(err instanceof global.Error)) {
            return ControllerUtils.respondWithErr<RegisterUserErrResponse>({ status: ClientErrorStatusCodes.BadRequest, data: err }, res)
        } else if (err) {
            return ControllerUtils.respondWithUnexpectedErr(res);
        }

        const { accessToken, refreshToken } = await generateTokens(user, newTokenHash);

        if (!accessToken || !refreshToken) {
            // return 500 status if accessToken couldn't be created for some reason
            return ControllerUtils.respondWithErr<RegisterUserErrResponse>({ 
                status: ServerErrorStatusCodes.InternalServerError, 
                data: { error: RegisterUserErrors.UnexpectedCondition } 
            }, res);
        }

        const userJSON = await user.toShallowUserJSON()

        res.json({
            ...userJSON,
            accessToken,
            refreshToken
        }).end();
    })
}

export const LoginUserController: RouteController<LoginUserRequest, {}> = async (req, res) => {
    const { email, password } = req.body;

    const inputErr = AuthUtils.validateLoginFields({ email, password });

    if (inputErr) {
        return ControllerUtils.respondWithErr<LoginUserErrResponse>({ 
            status: ClientErrorStatusCodes.BadRequest, 
            data: { error: LoginUserErrors.MissingUserInput, field: inputErr.field, errMsg: inputErr.msg } 
        }, res)
    }

    // hash that will be used to enforce that a refresh token is only used once
    const newTokenHash = await generateRandomHash();

    db.User.findOneAndUpdate({ email }, { $set: { jwtHash: newTokenHash } }, async (err: NativeError, user: IUserDocument | null) => {
        if (err) {
            // status 500 if any error occurred while finding the user's collection, not including if it wasn't found
            return ControllerUtils.respondWithUnexpectedErr(res);
        } else if (!user) {
            return ControllerUtils.respondWithErr<LoginUserErrResponse>({ 
                status: ClientErrorStatusCodes.NotFound, 
                data: { error: LoginUserErrors.IncorrectEmailOrPassword, errMsg: "Incorrect email or password." } 
            }, res)
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            return ControllerUtils.respondWithErr<LoginUserErrResponse>({ 
                status: ClientErrorStatusCodes.NotFound, 
                data: { error: LoginUserErrors.IncorrectEmailOrPassword, errMsg: "Incorrect email or password." } 
            }, res);
        }

        const { accessToken, refreshToken } = await generateTokens(user, newTokenHash);

        if (!accessToken || !refreshToken) {
            // 500 status if accessToken couldn't be created for some reason
            return ControllerUtils.respondWithUnexpectedErr(res);
        }

        const userJSON = await user.toShallowUserJSON();

        return res.json({
            ...userJSON,
            accessToken,
            refreshToken
        }).end();
    })
}

/* Refreshes access and refresh tokens */
export const RefreshTokensController: RouteController<RefreshTokensRequest, {}> = async (req, res) => {
    const refreshToken = JWTUtils.getTokenFromHeader(req);
    const token = JWTUtils.verifyRefreshToken(refreshToken ?? null);

    // if either the refresh token wasn't in the req header or any data on the token couldn't be verified, have user reauth
    if (!token || token.isExpired || !token.userId || !token.jwtHash || !refreshToken) {
        return haveUserReAuth(res);
    }

    let userId: mongoose.Types.ObjectId;

    try {
        userId = new mongoose.Types.ObjectId(token.userId);
    } catch (err) {
        return haveUserReAuth(res);
    }

    db.User.findById(token.userId, async (err: NativeError, user: IUserDocument | null) => {
        if (err || !user) {
            return haveUserReAuth(res);
        }

        // if refreh token hash doesn't match has in db, is not appropriate refresh token
        if (user.jwtHash && user.jwtHash !== token.jwtHash) {
            return haveUserReAuth(res);
        }

        // hash that will be used to enforce that a refresh token is only used once
        const newTokenHash = await generateRandomHash();

        db.User.updateOne({ _id: token.userId }, { $set: { jwtHash: newTokenHash } }, async (err: NativeError, data: any) => {
            if (err) {
                return haveUserReAuth(res);
            }

            const { accessToken, refreshToken } = await generateTokens(user, newTokenHash);

            if (!accessToken || !refreshToken) {
                return haveUserReAuth(res);
            }

            res.json({
                accessToken,
                refreshToken
            }).end()
        })
    })
}

const generateRandomHash = async () => {
    return await bcrypt.hash(SECRET, 10)
}

const JWTExpirationTime = ConfigUtils.getParam(MasterConfig.JWTSettings.AccessTokenExpirationTime, "1000")

const generateTokens = async (user: IUserDocument, hash: string) => {
    const accessToken = user.generateAccessToken(hash, JWTExpirationTime);
    const refreshToken = user.generateRefreshToken(hash);

    return { accessToken, refreshToken }
}