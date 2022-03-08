import { APIErrResponse } from "..";
import { IUserFullResponse } from "../../models/User";
import { GetUserErrors } from "./userRequests.errors";

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