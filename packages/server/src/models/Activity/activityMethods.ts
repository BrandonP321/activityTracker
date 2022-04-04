import { ActivityModel } from "@activitytracker/common/src/api/models/Activity.model";

/**
 * INSTANCE METHODS
 */

export const toActivityJSON: ActivityModel.InstanceMethods["toActivityJSON"] = async function(this: ActivityModel.Document) {
    const userJSON: ActivityModel.FullResponseJSON = {
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
