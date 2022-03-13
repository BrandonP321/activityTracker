import { APIErrResponse } from "..";
import { IBaseModelProperties } from "../../models";
import { IList } from "../../models/List.model";
import { CreateListErrors } from "./listRequests.errors";

export namespace CreateListRequest {

    export interface Request {
        UrlParams: {

        }
        ReqBody: {
            listName: string;
        }
        ResBody: {
            listId: string;
        }
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof CreateListErrors.Errors>;
};