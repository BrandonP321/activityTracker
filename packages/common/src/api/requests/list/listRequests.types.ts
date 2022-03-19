import { APIErrResponse } from "..";
import { IBaseModelProperties } from "../../models";
import { IList } from "../../models/List.model";
import { AddActivityToListErrors, CreateListErrors } from "./listRequests.errors";

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