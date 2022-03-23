import mongoose, { NativeError, Schema as ISchema } from "mongoose";
import type { IListDocument, IListMethods, IListModel } from "@activitytracker/common/src/api/models/List.model";
import { populateList, toListJSON } from "./listMethods";

const { Schema } = mongoose;

const ListSchema: ISchema<IListDocument, IListModel, IListDocument> = new Schema({
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

// ListSchema.pre("save", async function save(next) {
// });

/* handles any errors when new Activity document can't be created */
// ListSchema.post("save", handleUserDocSaveErr);

const listMethods: typeof ListSchema.methods & IListMethods = {
    ...ListSchema.methods,
    toListJSON,
    populateList,
}

ListSchema.methods = listMethods;

export const List = mongoose.model<IListDocument, IListModel>("List", ListSchema)
