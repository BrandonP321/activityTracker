import mongoose, { NativeError, Schema as ISchema } from "mongoose";
import type { ListModel } from "@activitytracker/common/src/api/models/List.model";
import { populateAllFields, toListJSON } from "./listMethods";

const { Schema } = mongoose;

const ListSchema = new Schema<ListModel.List, ListModel.Model, ListModel.InstanceMethods, ListModel.QueryHelpers>({
    name: {
        type: String,
        required: [true, "List name required"],
        index: true,
    },
    creatorId: {
        type: String,
        required: [true, "No creator id was provided for this new list"]
    },
    activities: {
        type: [mongoose.Types.ObjectId],
        ref: "Activity",
        default: []
    },
    users: {
        type: [mongoose.Types.ObjectId],
        ref: "User",
        default: []
    }
}, { timestamps: true })


// PLUGINS

// MIDDLEWARE

const listMethods: Required<ListModel.InstanceMethods> = {
    toListJSON,
    populateAllFields,
}

ListSchema.methods = {
    ...ListSchema.methods,
    ...listMethods
};

export const List = mongoose.model<ListModel.List, ListModel.Model>("List", ListSchema)
