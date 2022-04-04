import { ListModel } from "@activitytracker/common/src/api/models/List.model";
import { DocUtils } from "~Utils/DocUtils";

/**
 * INSTANCE METHODS
 */

export const toListJSON: ListModel.InstanceMethods["toListJSON"] = async function(this: ListModel.Document) {
    const userJSON: ListModel.FullResponseJSON = {
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

/* populates users & activities on List model */
export const populateAllFields: ListModel.InstanceMethods["populateAllFields"] = async function(this: ListModel.Document) {
    return await DocUtils.populateField<ListModel.AllPopulatedDoc>(this, ["users", "activities"]);
}