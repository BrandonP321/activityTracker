import mongoose, { Model, Query } from "mongoose";
import { IBaseModelProperties } from ".";
import { IActivity, IActivityDocument, IActivityFullResponse, IActivityModel } from "./Activity.model";

/* properties on User model */
export type IUser<ActivityType = mongoose.Types.ObjectId> = IBaseModelProperties & {
    email: string;
    password: string;
    fullName: string;
    username: string;
    profileImg: string;
    phone: string | null;
    /* random hash used to enforce refresh jwt's only being used once */
    jwtHash: string | null;
    /* activities created by the user */
    userActivities: ActivityType[];
    /* activities saved by the user */
    savedActivities: ActivityType[];
}

export type IUserMethods = {
    validatePassword: TValidatePassword;
    generateAccessToken: TGenerateAccessToken;
    generateRefreshToken: TGenerateRefreshToken;
    toShallowUserJSON: TToShallowUserJSON;
    toFullUserJSON: TToFullUserJSON;
    populateUserActivities: TPopulateUserActivities;
    toPopulatedUserJSON: TToPopulatedUserJSON;
}

/* instance methods of User Model */
export type IUserDocument<ActivityType = mongoose.Types.ObjectId> = mongoose.Document & IUserMethods & IUser<ActivityType>

/* static methods for User Schema */
export type IUserModel<ActivityType = mongoose.Types.ObjectId> = Model<IUserDocument, {}, IUserMethods> & IUserDocument<ActivityType> & IUser<ActivityType>;

/* properties sent to client when client only needs basic info to display for user */
export interface IUserShallowResponse {
    id: string;
    email: string;
    profileImg?: string;
    username: string;
    createdAt: string;
    updatedAt: string;
}

export type IUserFullResponse<ActivityType = mongoose.Types.ObjectId> = Omit<IUser<ActivityType>, "password" | "_id" | "jwtHash"> & {
    id: string;
}

export type IPopulatedUserModel = Omit<IUserModel<IActivityModel>, "toFullUserJSON"> & { 
    // static methods return different property types after document has been populated
    toFullUserJSON: TToFullUserJSON<IActivityFullResponse>;
}

export type IPopulatedUserFullResponse = IUserFullResponse<IActivityFullResponse> & {

}

// INSTANCE METHODS

export type TValidatePassword = (password: string) => Promise<boolean>;
export type TGenerateAccessToken = (hash: string, expiresIn: string) => string | undefined;
export type TGenerateRefreshToken = (hash: string) => string | undefined;
export type TToShallowUserJSON = () => Promise<IUserShallowResponse>;
export type TToFullUserJSON<ActivityType = mongoose.Types.ObjectId> = () => Promise<IUserFullResponse<ActivityType>>;
export type TPopulateUserActivities = () => Promise<IPopulatedUserModel | undefined>;
export type TToPopulatedUserJSON = () => Promise<IPopulatedUserFullResponse | undefined>;
// export type TPopulateChats = () => Promise<TToShallowChatJSONResponse[]>;

// STATIC METHODS
