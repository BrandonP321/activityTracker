import { BaseRequestErrorCodes, BaseRequestErrors } from "..";
import { RequestErrors } from "../RequestErrors";
import { ClientErrorStatusCodes } from "../StatusCodes";

export namespace GetUserErrors {

    export const ErrorCodes = {
        ...BaseRequestErrorCodes,
        UserNotFound: RequestErrors.InvalidId,
    } as const;

    export const Errors = {
        ...BaseRequestErrors,
        UserNotFound: (params?: {}) => ({
            status: ClientErrorStatusCodes.NotFound,
            error: ErrorCodes.UserNotFound
        })
    } as const;
};