import { Response } from "express";
import { CallbackError, Error } from "mongoose";
import { APIControllerErrors } from "@activitytracker/common/src/api/types/Error.types";

/* Error object sent back to client */
interface IAPIControllerErrResponse {
    errorType: APIControllerErrors;
    msg: string;
    errors?: {
        [key: string]: {
            path: string;
            msg: string;
        }
    }
}

/**
 * Handles the error thrown by a mongoose query callback according to the class instance of the error
 */
export const HandleControllerErr = (err: CallbackError, res: Response<any>) => {
    const ErrorResponse: IAPIControllerErrResponse = {
        errorType: APIControllerErrors.UnknownErr,
        msg: "An unexpected error has occurred"
    }
    let errStatus = 500
    console.error(err);

    if (err instanceof Error.ValidationError) {
        ErrorResponse.errorType = APIControllerErrors.ValidationError;
        ErrorResponse.msg = err.message;

        ErrorResponse.errors = {}

        for (let error in err.errors) {

            ErrorResponse.errors[error] = {
                path: error,
                msg: err.errors[error].message
            }
        }
    // } else if (err instanceof Error.ValidatorError) {

    // } else if (err instanceof Error.CastError) {

    // } else if (err instanceof Error.DocumentNotFoundError) {

    // } else if (err instanceof Error.ObjectExpectedError) {

    // } else if (err instanceof Error.ObjectParameterError) {

    // } else if (err instanceof Error.ParallelSaveError) {

    // } else if (err instanceof Error.ParallelValidateError) {

    // } else if (err instanceof Error.DisconnectedError) {

    } else {
        console.log("*** AN UNEXPECTED ERROR HAS OCCURED WHILE INTERACTING WITH A DB SCHEMA");
        console.log(err);
    }

    res.json(ErrorResponse).status(errStatus).end();

    return true;
}