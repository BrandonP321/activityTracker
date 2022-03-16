import mongoose, { Model, Query } from "mongoose";
import { IBaseModelProperties } from ".";
import { IActivity, IActivityDocument, IActivityFullResponse, IActivityModel } from "./Activity.model";
import { IList, IListFullResponse, IListModel } from "./List.model";

/* properties on User model */
export type IUser<ActivityType = mongoose.Types.ObjectId, ListType = mongoose.Types.ObjectId> = IBaseModelProperties & {
    email: string;
    password: string;
    fullName: string;
    username: string;
    profileImg: string;
    phone: string | null;
    /* random hash used to enforce refresh jwt's only being used once */
    jwtHash: {
        [key: string]: boolean;
    };
    /* activities created by the user */
    userActivities: ActivityType[];
    /* activities saved by the user */
    savedActivities: ActivityType[];
    lists: ListType[];
}

export type IUserMethods = {
    validatePassword: TValidatePassword;
    generateAccessToken: TGenerateAccessToken;
    generateRefreshToken: TGenerateRefreshToken;
    toShallowUserJSON: TToShallowUserJSON;
    toFullUserJSON: TToFullUserJSON;
    populateUserActivities: TPopulateUserActivities;
    populateUserLists: TPopulateUserLists;
    toPopulatedUserJSON: TToPopulatedUserJSON;
}

/* instance methods of User Model */
export type IUserDocument<ActivityType = mongoose.Types.ObjectId, ListType = mongoose.Types.ObjectId> = mongoose.Document & IUserMethods & IUser<ActivityType, ListType>

/* static methods for User Schema */
export type IUserModel<ActivityType = mongoose.Types.ObjectId, ListType = mongoose.Types.ObjectId> = Model<IUserDocument<ActivityType, ListType>, {}, IUserMethods> & IUserDocument<ActivityType, ListType> & IUser<ActivityType>;

/* properties sent to client when client only needs basic info to display for user */
export interface IUserShallowResponse {
    id: string;
    email: string;
    profileImg?: string;
    username: string;
    createdAt: string;
    updatedAt: string;
}

export type IUserFullResponse<ActivityType = mongoose.Types.ObjectId, ListType = mongoose.Types.ObjectId> = Omit<IUser<ActivityType, ListType>, "password" | "_id" | "jwtHash"> & {
    id: string;
}

/* User model when only activities are populated */
export type IPopulatedUserActivitiesModel = Omit<IUserModel<IActivityModel>, "toFullUserJSON"> & { 
    // static methods return different property types after document has been populated
    toFullUserJSON: TToFullUserJSON<IActivityFullResponse>;
}

/* User model when only lists are populated */
export type IPopulatedUserListsModel = Omit<IUserModel<mongoose.Types.ObjectId, IListModel>, "toFullUserJSON"> & { 
    // static methods return different property types after document has been populated
    toFullUserJSON: TToFullUserJSON<mongoose.Types.ObjectId, IListFullResponse>;
}

/* User model with all fields populated */
export type IPopulatedUserModel = Omit<IUserModel<IActivityModel, IListModel>, "toFullUserJSON"> & { 
    // static methods return different property types after document has been populated
    toFullUserJSON: TToFullUserJSON<IActivityFullResponse, IListFullResponse>;
}

export type IPopulatedUserFullResponse = IUserFullResponse<IActivityFullResponse, IListFullResponse> & {

}

// INSTANCE METHODS

export type TValidatePassword = (password: string) => Promise<boolean>;
export type TGenerateAccessToken = (hash: string) => string | undefined;
export type TGenerateRefreshToken = (hash: string) => string | undefined;
export type TToShallowUserJSON = () => Promise<IUserShallowResponse>;
export type TToFullUserJSON<ActivityType = mongoose.Types.ObjectId, ListType = mongoose.Types.ObjectId> = () => Promise<IUserFullResponse<ActivityType, ListType>>;

export type TPopulateUserActivities = () => Promise<IPopulatedUserActivitiesModel | undefined>;
export type TPopulateUserLists = () => Promise<IPopulatedUserListsModel | undefined>;

export type TToPopulatedUserJSON = (maxListLength?: number) => Promise<IPopulatedUserFullResponse | undefined>;
// export type TPopulateChats = () => Promise<TToShallowChatJSONResponse[]>;

// STATIC METHODS
