import { IListDocument, IListFullResponse, IListModel, TToListJSON } from "@activitytracker/common/src/api/models/List.model";

/**
 * INSTANCE METHODS
 */

export const toListJSON: TToListJSON = async function(this: IListModel) {
    const userJSON: IListFullResponse = {
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        id: this._id.toString(),
        creatorId: this.creatorId,
        activities: this.activities ?? [],
        name: this.name ?? [],
        users: this.users ?? []
    }

    return userJSON;
}

// export type IActivityDocSaveErr = ValidErrRes<RegisterUserRequest.ErrResponse["response"]["data"]> | undefined

// export const handleActivityDocSaveErr = async function(err: { code?: number; [key: string]: any } & Error, doc: IActivityDocument, next: (err: any) => void) {
//     let errObj: IActivityDocSaveErr = undefined;

//     if (err instanceof mongoose.Error.ValidationError) {
//     }

//     if (!errObj) {
//         errObj = RegisterUserErrors.Errors.UnexpectedCondition();
//     }

//     next(errObj)
// }

/**
 * STATIC METHODS
 */


/**
 * QUERY HELPERS
 */


// export const findUserById = function(this: Query<any, IUserDocument, {}, IUserDocument>, id: mongoose.ObjectId) {
//     return this.findById(id);
// }