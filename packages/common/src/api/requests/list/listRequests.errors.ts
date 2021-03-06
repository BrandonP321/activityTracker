import { BaseRequestErrorCodes, BaseRequestErrors } from "..";
import { RequestErrors } from "../RequestErrors";
import { ClientErrorStatusCodes } from "../StatusCodes";

export namespace CreateListErrors {

    export const ErrorCodes = {
        ...BaseRequestErrorCodes,
        InvalidInputType: "InvalidInputType",
        CreatorUserNotFound: "CreatorUserNotFound",
    } as const;

    export const Errors = {
        ...BaseRequestErrors,
        InvalidInputType: (params?: { field: string; errMsg: string; }) => ({
            status: ClientErrorStatusCodes.NotFound,
            error: ErrorCodes.InvalidInputType,
            errorMsg: params?.errMsg ?? "",
            field: params?.field ?? "",
        }),
        CreatorUserNotFound: (params?: {}) => ({
            status: ClientErrorStatusCodes.NotFound,
            error: ErrorCodes.CreatorUserNotFound
        })
    } as const;
};

export namespace AddActivityToListErrors {

    export const ErrorCodes = {
        ...BaseRequestErrorCodes,
        ActivityNotFound: "ActivityNotFound",
        ListNotFound: "ListNotFound",
        UserNotInList: "UserNotInList",
    } as const;

    export const Errors = {
        ...BaseRequestErrors,
        ActivityNotFound: (params?: {}) => ({
            status: ClientErrorStatusCodes.NotFound,
            error: ErrorCodes.ActivityNotFound,
        }),
        ListNotFound: (params?: {}) => ({
            status: ClientErrorStatusCodes.NotFound,
            error: ErrorCodes.ListNotFound,
        }),
        UserNotInList: (params?: {}) => ({
            status: ClientErrorStatusCodes.Forbidden,
            error: ErrorCodes.UserNotInList,
        }),
    } as const;
};

export namespace GetListErrors {

    export const ErrorCodes = {
        ...BaseRequestErrorCodes,
        ListNotFound: "ListNotFound",
        UserNotInList: "UserNotInList",
    } as const;

    export const Errors = {
        ...BaseRequestErrors,
        ListNotFound: (params?: {}) => ({
            status: ClientErrorStatusCodes.NotFound,
            error: ErrorCodes.ListNotFound,
        }),
        UserNotInList: (params?: {}) => ({
            status: ClientErrorStatusCodes.Forbidden,
            error: ErrorCodes.UserNotInList,
        }),
    } as const;
};