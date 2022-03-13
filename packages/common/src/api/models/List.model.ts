import mongoose, { Model } from "mongoose";
import { IBaseModelProperties } from ".";

/* properties on List model */
export type IList = IBaseModelProperties & {
    name: string;
    creatorId: string;
    activities: mongoose.Types.ObjectId[];
    users: mongoose.Types.ObjectId[];
}

export interface IListMethods {
    toListJSON: TToListJSON;
}

/* instance methods of List Model */
export type IListDocument = mongoose.Document & IListMethods & IList

/* static methods for List Schema */
export type IListModel = Model<IListDocument, {}, IListMethods> & IListDocument & IList;

/* properties sent to client when client only needs basic info to display for List */
export interface IListShallowResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface IListFullResponse extends Omit<IList, "_id"> {
    id: string;
}

// INSTANCE METHODS

export type TToListJSON = () => Promise<IListFullResponse>;

// STATIC METHODS
