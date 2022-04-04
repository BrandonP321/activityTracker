import { APIErrResponse } from "..";
import { ActivityModel } from "../../models/Activity.model";
import { ListModel } from "../../models/List.model";
import { UserModel } from "../../models/User.model";
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
        ResBody: ListModel.AllPopulatedFullResponseJSON & {
        }
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof GetListErrors.Errors>;
};