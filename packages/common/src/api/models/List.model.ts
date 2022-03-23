import mongoose, { Model } from "mongoose";
import { IBaseModelProperties } from ".";
import { IActivityModel } from "./Activity.model";
import { IUserModel } from "./User.model";

/* properties on List model */
export type IList<isPopulated = false> = IBaseModelProperties & {
    name: string;
    creatorId: string;
    activities: isPopulated extends true ? IActivityModel[] : mongoose.Types.ObjectId[];
    users: isPopulated extends true ? IUserModel[] : mongoose.Types.ObjectId[];
}

export interface IListMethods<isPopulated = false> {
    toListJSON: isPopulated extends true ? TToPopulatedListJSON : TToListJSON;
    populateList: TPopulateList;
}

/* instance methods of List Model */
export type IListDocument<isPopulated = false> = mongoose.Document & IListMethods<isPopulated> & IList<isPopulated>

/* static methods for List Schema */
export type IListModel<isPopulated = false> = Model<IListDocument<isPopulated>, {}, IListMethods<isPopulated>> & IListDocument<isPopulated> & IList<isPopulated>;

/* List model after users & activities have been populated */
export type IPopulatedListModel = IListModel<true>

/* properties sent to client when client only needs basic info to display for List */
export interface IListShallowResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface IListFullResponse<isPopulated = false> extends Omit<IList<isPopulated>, "_id"> {
    id: string;
}

export type IPopulatedListFullResponse = IListFullResponse<true>;

// INSTANCE METHODS

export type TToListJSON = () => Promise<IListFullResponse>;
export type TToPopulatedListJSON = () => Promise<IPopulatedListFullResponse>;
export type TPopulateList = () => Promise<IPopulatedListModel | undefined>

// STATIC METHODS
