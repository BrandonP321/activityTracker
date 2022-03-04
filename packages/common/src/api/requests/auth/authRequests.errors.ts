import { BaseRequestErrorCodes, BaseRequestErrors } from "..";
import { RequestErrors } from "../RequestErrors";
import { ClientErrorStatusCodes } from "../StatusCodes";

export namespace RegisterUserErrors {

    export const ErrorCodes = {
        ...BaseRequestErrorCodes,
        /* field input from user does not meet constraints for that field */
        InvalidUserInput: RequestErrors.InvalidUserInput,
        EmailOrUsernameTaken: RequestErrors.UniqueFieldTaken,
    } as const;
    
    export const Errors = {
        ...BaseRequestErrors,
        InvalidUserInput: (params?: { field: string; errMsg: string; }) => ({
            status: ClientErrorStatusCodes.NotFound,
            error: ErrorCodes.InvalidUserInput,
            errorMsg: params?.errMsg ?? "",
            field: params?.field ?? "",
        }),
        EmailOrUsernameTaken: (params?: { errorMsg: string; credTaken: "email" | "username"; }) => ({
            status: ClientErrorStatusCodes.BadRequest,
            error: ErrorCodes.EmailOrUsernameTaken,
            errorMsg: params?.errorMsg ?? "",
            credTaken: params?.credTaken ?? ""
        })
    } as const;
}

export namespace LoginUserErrors {

    export const ErrorCodes = {
        ...BaseRequestErrorCodes,
        IncorrectEmailOrPassword: "IncorrectEmailOrPassword",
        MissingUserInput: "MissingUserInput"
    } as const;

    export const Errors = {
        ...BaseRequestErrors,
        IncorrectEmailOrPassword: (params?: {}) => ({
            status: ClientErrorStatusCodes.NotFound,
            error: RequestErrors.InvalidUserCredentialInput,
            errorMsg: "incorrect email or password.",
        }),
        MissingUserInput: (params?: { errorMsg: string; field: string; }) => ({
            status: ClientErrorStatusCodes.BadRequest,
            error: RequestErrors.InvalidUserCredentialInput,
            errorMsg: params?.errorMsg ?? "",
            field: params?.field ?? ""
        })
    } as const;
}