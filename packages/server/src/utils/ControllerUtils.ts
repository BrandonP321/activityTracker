import { RequestErrors } from "@activitytracker/common/src/api/requests/RequestErrors";
import { ServerErrorStatusCodes } from "@activitytracker/common/src/api/requests/StatusCodes";
import type { Response } from "express";

// used to verify the response object properties for a given status code
export type ValidErrRes<T extends { status: number; data: { error: string } }> = T["data"];

export class ControllerUtils {
    public static setResponseHeader(header: ValidHeaders, value: string, res: Response) {
        return res.setHeader(header, value);
    }

    /* responds to express http request with an appropriate data response for the given status code */
    public static respondWithErr<T extends { response: { status: number; data: { error: string } } }>(errObj: { status: number; data: ValidErrRes<T["response"]> }, res: Response) {
        try {
            res.status(errObj.status).json(errObj.data).end();
        } catch (err) {
            res.status(ServerErrorStatusCodes.InternalServerError).end();
        }
    }

    /* responsed to http request with 500 error for an unexpected server error */
    public static respondWithUnexpectedErr(res: Response) {
        this.respondWithErr({ status: ServerErrorStatusCodes.InternalServerError, data: { error: RequestErrors.UnexpectedCondition }}, res);
    }
}

type ValidHeaders = 
    "authorization"