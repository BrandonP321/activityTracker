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

    export type ErrResponse = ReturnType<typeof GetUserErrors.Errors[keyof typeof GetUserErrors.Errors]>;
};

// export interface UserSearchRequest {
//     UrlParams: {
//         userInput: string;
//     }
//     ReqBody: {
//     }
//     ResBody: {
//         foundUsers: IUserShallowResponse[]
//     }
//     headers: {
        
//     }
// }

// export const UserSearchErrors = {
//     /* field input from user does not meet constraints for that field */
//     // InvalidUserInput: RequestErrors.InvalidUserInput,
//     /* one or more of the user id's provided for chat was invalid */
//     // InvalidUserIds: RequestErrors.OneOrMoreInvalidUserIds,
//     // UnexpectedCondition: RequestErrors.UnexpectedCondition
// } as const

// export type UserSearchErrResponse = {
//     response: {
//         status: ClientErrorStatusCodes | ServerErrorStatusCodes;
//         data: {

//         } | ProtectedRouteErrors
//     }
// }