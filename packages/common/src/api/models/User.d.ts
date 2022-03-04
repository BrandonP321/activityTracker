import mongoose, { Model, Query } from "mongoose";
import { IBaseModelProperties } from ".";
// import { TToShallowChatJSONResponse } from "./Chat.modle";

/* properties on User model */
export interface IUser extends IBaseModelProperties {
    email: string;
    password: string;
    fullName: string;
    username: string;
    profileImg: string;
    phone: string;
    /* random hash used to enforce refresh jwt's only being used once */
    jwtHash: string;
}

export interface IUserMethods {
    validatePassword: TValidatePassword;
    generateAccessToken: TGenerateAccessToken;
    generateRefreshToken: TGenerateRefreshToken;
    toShallowUserJSON: TToShallowUserJSON;
    toFullUserJSON: TToFullUserJSON;
}

/* instance methods of User Model */
export type IUserDocument = mongoose.Document & IUserMethods & IUser

/* static methods for User Schema */
export type IUserModel = Model<IUserDocument, {}, IUserMethods> & IUserDocument & IUser;

/* properties sent to client when client only needs basic info to display for user */
export interface IUserShallowResponse {
    id: string;
    email: string;
    profileImg?: string;
    username: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUserFullResponse extends Omit<IUser, "password" | "_id" | "jwtHash"> {
    id: string;
}


// INSTANCE METHODS

export type TValidatePassword = (password: string) => Promise<boolean>;
export type TGenerateAccessToken = (hash: string, expiresIn: string) => string | undefined;
export type TGenerateRefreshToken = (hash: string) => string | undefined;
export type TToShallowUserJSON = () => Promise<IUserShallowResponse>;
export type TToFullUserJSON = () => Promise<IUserFullResponse>;
// export type TPopulateChats = () => Promise<TToShallowChatJSONResponse[]>;

// STATIC METHODS
