import { IPopulatedUserModel, IUserDocument, IUserFullResponse, IUserModel, TGenerateAccessToken, TGenerateRefreshToken, TPopulateUserActivities, TToFullUserJSON, TToPopulatedUserJSON, TToShallowUserJSON, TValidatePassword } from "@activitytracker/common/src/api/models/User.model";
import { RegisterUserErrors, RegisterUserRequest } from "@activitytracker/common/src/api/requests/auth";
import bcrypt from "bcrypt";
import { ValidErrRes } from "~Utils/ControllerUtils";
import { JWTUtils } from "~Utils/JWTUtils";
import mongoose from "mongoose";
import { IActivityModel } from "@activitytracker/common/src/api/models/Activity.model";
import { MongooseObjectId } from "~Utils/MongooseUtils";

/**
 * INSTANCE METHODS
 */

export const validatePassword: TValidatePassword = async function(this: IUserModel, pass: string) {
    return bcrypt.compare(pass, this.password);
}

export const generateAccessToken: TGenerateAccessToken = function(this: IUserModel, hash: string, expiresIn) {
    const token = JWTUtils.signAccessToken(this._id.toString(), hash, expiresIn);

    return token;
}

export const generateRefreshToken: TGenerateRefreshToken = function(this: IUserModel, hash) {
    const token = JWTUtils.signRefreshToken(this._id.toString(), hash);

    return token;
}

/* converts user response to a shallow response with only basic user info */
export const toShallowUserJSON: TToShallowUserJSON = async function(this: IUserModel) {
    return {
        id: this._id.toString(),
        email: this.email,
        username: this.username,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
}

export const toFullUserJSON: TToFullUserJSON = async function(this: IUserModel) {
    const userJSON: IUserFullResponse = {
        id: this._id.toString(),
        email: this.email,
        username: this.username,
        fullName: this.fullName,
        phone: this.phone ?? null,
        profileImg: this.profileImg,
        userActivities: this.userActivities ?? [],
        savedActivities: this.savedActivities ?? [],
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    }

    return userJSON;
}

export type IUserDocSaveErr = ValidErrRes<RegisterUserRequest.ErrResponse["response"]["data"]> | undefined

export const handleUserDocSaveErr = async function(err: { code?: number; [key: string]: any } & Error, doc: IUserDocument, next: (err: any) => void) {
    let errObj: IUserDocSaveErr = undefined;

    if (err.code && err.code === 11000 && err.keyValue) {
        // error code 11000 indicates a duplicate of a unique key
        const errField = Object.keys(err.keyValue)[0]
        if (errField === "email" || errField === "username") {
            const errMsg = `An account with this ${errField} already exists.`;
            errObj = RegisterUserErrors.Errors.EmailOrUsernameTaken({ credTaken: errField, errorMsg: errMsg })
        } else {
            errObj = RegisterUserErrors.Errors.UnexpectedCondition();
        }
    } else if (err instanceof mongoose.Error.ValidationError) {
        // validation of a property failed and we know it's not due to a duplicate key
        for (const errKey in err.errors) {
            const error = err.errors[errKey];

            if (error instanceof mongoose.Error.ValidatorError) {
                switch (error.kind) {
                    case "required":
                    case "regexp":
                        if (errKey === "username" || errKey === "email") {
                            errObj = RegisterUserErrors.Errors.InvalidUserInput({ field: errKey, errMsg: `Please provide a valid ${errKey}.` });
                            break;
                        }
                }

                // break out of for loop if error has been found
                if (errObj) {
                    break;
                }
            } else if (error instanceof mongoose.Error.ValidationError) {
                console.log("Validation Error")
            } else if (error instanceof mongoose.Error.CastError) {
                console.log("Case Error")
            }
        }
    }

    if (!errObj) {
        errObj = RegisterUserErrors.Errors.UnexpectedCondition();
    }

    next(errObj)
}

export const populateUserActivities: TPopulateUserActivities = async function(this: IUserModel) {
    try {
        // TODO: also populate savedActivites
        const populated: IPopulatedUserModel = await this.populate("userActivities");
        
        // await populated.populate("savedActivities");
        // console.log(maxListLength, populated.userActivities)

        return populated;
    } catch(err) {
        console.log(err);
        return undefined
    }
}

export const toPopulatedUserJSON: TToPopulatedUserJSON = async function(this: IUserModel, maxListLength?: number) {
    try {
        const populatedWithActivities = await this.populateUserActivities();

        if (!populatedWithActivities) {
            return undefined;
        }

        const popuplatedUser = await populatedWithActivities.toFullUserJSON();

        popuplatedUser.userActivities = popuplatedUser.userActivities.slice(0, maxListLength);

        return popuplatedUser;
    } catch (err) {
        return undefined;
    }
}

/**
 * STATIC METHODS
 */


/**
 * QUERY HELPERS
 */


// export const findUserById = function(this: Query<any, IUserDocument, {}, IUserDocument>, id: mongoose.ObjectId) {
//     return this.findById(id);
// }