import { APIErrResponse } from "..";
import { ListModel } from "../../models/List.model";
import { UserModel } from "../../models/User.model";
import { GetUserDashDataErrors, GetUserErrors } from "./userRequests.errors";

export namespace GetUserRequest {

    export interface Request {
        UrlParams: {
            id: string;
        }
        ReqBody: {
            
        }
        ResBody: {
        } & UserModel.FullResponseJSON
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
        } & UserModel.AllPopulatedFullResponseJSON
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
            lists: ListModel.FullResponseJSON[];
        }
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof GetUserDashDataErrors.Errors>;
};