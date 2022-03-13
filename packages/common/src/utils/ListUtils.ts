import { CreateListRequest } from "../api/requests/list";

export namespace ListCreation {
    export type Fields = CreateListRequest.Request["ReqBody"];

    export type InputErr = { msg: string, field: keyof Fields };
}

export class ListUtils {
    public static validateCreationFields(fields: ListCreation.Fields) {
        const { listName } = fields;

        let errObj: null | ListCreation.InputErr = null;

        if (!listName) {
            errObj = { field: "listName", msg: "List name required" }
        }

        return errObj;
    }
}