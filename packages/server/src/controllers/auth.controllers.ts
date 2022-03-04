import { ControllerUtils } from "~Utils/ControllerUtils";
import { LoginUserErrors, LoginUserRequest, RegisterUserErrors, RegisterUserRequest } from "@activitytracker/common/src/api/requests/auth";
import db from "~Models"
import mongoose, { CallbackError, NativeError } from "mongoose";
import { IUser, IUserDocument } from "@activitytracker/common/src/api/models/User.d";
import { RouteController } from "./index";
import bcrypt from "bcrypt";
import { EnvUtils, ServerEnvVars } from "@activitytracker/common/src/utils/EnvUtils";
import { AuthUtils } from "@activitytracker/common/src/utils/AuthUtils";
import { IUserDocSaveErr } from "~Models/User/userMethods";
import { ConfigUtils } from "@activitytracker/common/src/utils/ConfigUtils"
import { MasterConfig } from "@activitytracker/common/src/config"
import { Response } from "express"

const SECRET = EnvUtils.getEnvVar(ServerEnvVars.SECRET, "");

export const RegisterUserController: RouteController<RegisterUserRequest.Request, {}> = async (req, res) => {
    const { email, fullName, password, passwordReEnter, phone, username } = req.body;

    // validate input from user
    const inputErr = AuthUtils.validateRegistrationFields({ email, fullName, password, passwordReEnter, phone, username })

    if (inputErr) {
        return ControllerUtils.respondWithErr(RegisterUserErrors.Errors.InvalidUserInput({ errMsg: inputErr.msg, field: inputErr.field }), res)
    }

    // hash that will be used to enforce that a refresh token is only used once
    const newTokenHash = await generateRandomHash();

    const user: Partial<IUser> = {
        ...req.body,
        jwtHash: newTokenHash
    }

    db.User.create(user, async (err: CallbackError | IUserDocSaveErr, user) => {
        if (err && !(err instanceof global.Error)) {
            return ControllerUtils.respondWithErr(err, res)
        } else if (err) {
            return ControllerUtils.respondWithUnexpectedErr(res);
        }

        try {
            createTokenCookies(user, newTokenHash, res);
        } catch (err) {
            return ControllerUtils.respondWithUnexpectedErr(res);
        }

        const userJSON = await user.toShallowUserJSON()

        res.json({
            ...userJSON
        }).end();
    })
}

export const LoginUserController: RouteController<LoginUserRequest.Request, {}> = async (req, res) => {
    const { email, password } = req.body;

    const inputErr = AuthUtils.validateLoginFields({ email, password });

    if (inputErr) {
        return ControllerUtils.respondWithErr(LoginUserErrors.Errors.MissingUserInput({ errorMsg: inputErr.msg, field: inputErr.field }), res);
    }

    // hash that will be used to enforce that a refresh token is only used once
    const newTokenHash = await generateRandomHash();

    db.User.findOneAndUpdate({ email }, { $set: { jwtHash: newTokenHash } }, async (err: NativeError, user: IUserDocument | null) => {
        if (err) {
            // status 500 if any error occurred while finding the user's collection, not including if it wasn't found
            return ControllerUtils.respondWithUnexpectedErr(res);
        } else if (!user) {
            return ControllerUtils.respondWithErr(LoginUserErrors.Errors.IncorrectEmailOrPassword({}), res)
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            return ControllerUtils.respondWithErr(LoginUserErrors.Errors.IncorrectEmailOrPassword({}), res);
        }

        try {
            createTokenCookies(user, newTokenHash, res);
        } catch (err) {
            return ControllerUtils.respondWithUnexpectedErr(res);
        }

        const userJSON = await user.toShallowUserJSON();

        return res.json({
            ...userJSON
        }).send().end();
    })
}

const createTokenCookies = (user: IUserDocument, hash: string, res: Response) => {
    const accessToken = user.generateAccessToken(hash, JWTExpirationTime);
    const refreshToken = user.generateRefreshToken(hash);

    const tokens = {
        accessToken, refreshToken
    }

    res.cookie("siteTokens", JSON.stringify(tokens), {
        // forces use of https in production
        secure: !EnvUtils.isLocal,
        // makes tokens inaccessible in client's javascript
        httpOnly: true,
        maxAge: 24 * 60 * 60
    })

    return tokens;
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