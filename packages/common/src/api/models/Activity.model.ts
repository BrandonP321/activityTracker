import mongoose, { Model } from "mongoose";
import { IBaseModelProperties } from ".";

/* properties on activity model */
export interface IActivity extends IBaseModelProperties {
    name: string;
    tags: string[];
    price: number | null;
    numbPeople: {
        amount: number | null;
        orLess: boolean;
        orMore: boolean;
    }
    location: string | null;
    url: string | null;
    creatorId: string;
}

export interface IActivityMethods {
    toActivityJSON: TToActivityJSON;
}

/* instance methods of activity Model */
export type IActivityDocument = mongoose.Document & IActivityMethods & IActivity

/* static methods for activity Schema */
export type IActivityModel = Model<IActivityDocument, {}, IActivityMethods> & IActivityDocument & IActivity;

/* properties sent to client when client only needs basic info to display for activity */
export interface IActivityShallowResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface IActivityFullResponse extends Omit<IActivity, "_id"> {
    id: string;
}

// INSTANCE METHODS

export type TToActivityJSON = () => Promise<IActivityFullResponse>;
// export type TPopulateChats = () => Promise<TToShallowChatJSONResponse[]>;

// STATIC METHODS
