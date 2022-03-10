import { IActivityDocument, IActivityFullResponse, IActivityModel, TToActivityJSON } from "@activitytracker/common/src/api/models/Activity.model";

/**
 * INSTANCE METHODS
 */

export const toActivityJSON: TToActivityJSON = async function(this: IActivityModel) {
    const userJSON: IActivityFullResponse = {
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        id: this._id.toString(),
        location: this.location,
        name: this.name,
        numbPeople: this.numbPeople,
        price: this.price ?? null,
        tags: this.tags,
        url: this.url ?? null,
        creatorId: this.creatorId
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