import { APIErrResponse } from "..";
import { IBaseModelProperties } from "../../models";
import { IActivityFullResponse } from "../../models/Activity.model";
import { IList, IListFullResponse, IPopulatedListFullResponse } from "../../models/List.model";
import { IUserShallowResponse } from "../../models/User.model";
import { AddActivityToListErrors, CreateListErrors, GetListErrors } from "./listRequests.errors";

export namespace CreateListRequest {

    export interface Request {
        UrlParams: {

        }
        ReqBody: {
            listName: string;
        }
        ResBody: {
            listId: string;
        }
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof CreateListErrors.Errors>;
};

/* Adds existing activity to a List */
export namespace AddActivityToListRequest {

    export interface Request {
        UrlParams: {

        }
        ReqBody: {
            listId: string;
            activityId: string;
        }
        ResBody: {
            listId: string;
        }
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof AddActivityToListErrors.Errors>;
};

export namespace GetListRequest {

    export interface Request {
        UrlParams: {
            listId: string;
        }
        ReqBody: {
        }
        ResBody: Omit<IPopulatedListFullResponse, "activities" | "users"> & {
            activities: IActivityFullResponse[];
            users: IUserShallowResponse[];
        }
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof GetListErrors.Errors>;
};