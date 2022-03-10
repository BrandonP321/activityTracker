import { BaseRequestErrorCodes, BaseRequestErrors } from "..";
import { RequestErrors } from "../RequestErrors";
import { ClientErrorStatusCodes } from "../StatusCodes";

export namespace CreateActivityErrors {

    export const ErrorCodes = {
        ...BaseRequestErrorCodes,
        InvalidInputType: "InvalidInputType",
        UserNotFound: "UserNotFound",
    } as const;

    export const Errors = {
        ...BaseRequestErrors,
        InvalidInputType: (params?: { field: string; errMsg: string; }) => ({
            status: ClientErrorStatusCodes.NotFound,
            error: ErrorCodes.InvalidInputType,
            errorMsg: params?.errMsg ?? "",
            field: params?.field ?? "",
        }),
        UserNotFound: (params?: {}) => ({
            status: ClientErrorStatusCodes.NotFound,
            error: ErrorCodes.UserNotFound
        })
    } as const;
};

export namespace GetUserActivitiesErrors {

    export const ErrorCodes = {
        ...BaseRequestErrorCodes,
        UserNotFound: "UserNotFound",
    } as const;

    export const Errors = {
        ...BaseRequestErrors,
        UserNotFound: (params?: {}) => ({
            status: ClientErrorStatusCodes.NotFound,
            error: ErrorCodes.UserNotFound
        })
    } as const;
};