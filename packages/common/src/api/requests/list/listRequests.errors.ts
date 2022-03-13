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