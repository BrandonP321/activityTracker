import { APIErrResponse } from "..";
import { IListFullResponse } from "../../models/List.model";
import { IPopulatedUserFullResponse, IUserFullResponse } from "../../models/User.model";
import { GetUserDashDataErrors, GetUserErrors } from "./userRequests.errors";

export namespace GetUserRequest {

    export interface Request {
        UrlParams: {
            id: string;
        }
        ReqBody: {
            
        }
        ResBody: {
        } & IUserFullResponse
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof GetUserErrors.Errors>;
};

export namespace GetUserDashDataRequest {

    export interface Request {
        UrlParams: {

        }
        ReqBody: {
            
        }
        ResBody: {
            quickStats: {
                listsCount: number;
                userActivitiesCount: number;
                savedActivitiesCount: number;
                friendsCount: number;
            }
        } & IPopulatedUserFullResponse
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof GetUserDashDataErrors.Errors>;
};

export namespace GetUserListsRequest {

    export interface Request {
        UrlParams: {

        }
        ReqBody: {
            
        }
        ResBody: {
            lists: IListFullResponse[];
        }
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof GetUserDashDataErrors.Errors>;
};