import { APIRequestResponse } from ".";
import { TRegistrationFields } from "../../utils/AuthUtils";
import { IUserShallowResponse } from "../models/User";
import { RequestErrors } from "./RequestErrors";
import { ClientErrorStatusCodes, ServerErrorStatusCodes } from "./StatusCodes";

export interface RegisterUserRequest {
    UrlParams: {

    }
    ReqBody: {
        email: string;
        password: string;
        passwordReEnter: string;
        fullName: string;
        username: string;
        phone?: string;
    }
    ResBody: {
        accessToken: string;
        refreshToken: string;
    } & IUserShallowResponse
    headers: {

    }
}

export const RegisterUserErrors = {
    /* field input from user does not meet constraints for that field */
    InvalidUserInput: RequestErrors.InvalidUserInput,
    EmailOrUsernameTaken: RequestErrors.UniqueFieldTaken,
    UnexpectedCondition: RequestErrors.UnexpectedCondition
} as const

export type RegisterUserErrResponse = {
    response: {
        status: ClientErrorStatusCodes | ServerErrorStatusCodes;
        data: {
            error: typeof RegisterUserErrors.InvalidUserInput
            field: keyof TRegistrationFields | "matchingPasswords";
            errMsg: string;
        } | {
            error: typeof RegisterUserErrors.EmailOrUsernameTaken,
            credTaken: "email" | "username",
            errMsg: string;
        } | {
            error: typeof RegisterUserErrors.UnexpectedCondition
        }
    }
}

export interface LoginUserRequest {
    UrlParams: {

    }
    ReqBody: {
        email: string;
        password: string;
    }
    ResBody: {
        accessToken: string;
        refreshToken: string;
    } & IUserShallowResponse,
    headers: {
        
    }
}

export const LoginUserErrors = {
    MissingUserInput: RequestErrors.InvalidUserInput,
    IncorrectEmailOrPassword: RequestErrors.InvalidUserCredentialInput,
    UnexpectedCondition: RequestErrors.UnexpectedCondition
} as const

export type LoginUserErrResponse = {
    response: {
        status: ClientErrorStatusCodes | ServerErrorStatusCodes;
        data: {
            error: typeof LoginUserErrors.IncorrectEmailOrPassword;
            errMsg: string;
        } | {
            error: typeof LoginUserErrors.MissingUserInput;
            errMsg: string;
            field: "email" | "password"
        } | {
            error: typeof LoginUserErrors.UnexpectedCondition
        }
    }
}

export interface RefreshTokensRequest {
    UrlParams: {

    }
    ReqBody: {
        
    }
    ResBody: {
        accessToken: string;
        refreshToken: string;
    },
    headers: {
        authorization: string;
    }
}

export enum RefreshTokensErrCodes {
    IncorretEmailPassword = ClientErrorStatusCodes.Unauthorized,
    UnexpectedCondition = ServerErrorStatusCodes.InternalServerError
}