import mongoose, { NativeError, Schema as ISchema } from "mongoose";
import bcrypt from "bcrypt";
import type { IActivityDocument, IActivityMethods, IActivityModel } from "@activitytracker/common/src/api/models/Activity.model";
import { toActivityJSON } from "./activityMethods";

const { Schema } = mongoose;

const ActivitySchema: ISchema<IActivityDocument, IActivityModel, IActivityDocument> = new Schema({
    name: {
        type: String,
        required: [true, "Activity name required"],
        index: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    price: {
        type: Number,
        default: null,
    },
    numbPeople: {
        type: {
            amount: {
                type: Number,
                default: null,
            },
            orLess: {
                type: Boolean,
                default: false,
            },
            orMore: {
                type: Boolean,
                default: false,
            }
        },
        default: {
            amount: null,
            orLess: false,
            orMore: false
        }
    },
    location: {
        type: String,
        default: null,
    },
    url: {
        type: String,
        default: null
    },
    creatorId: {
        type: String,
        required: [true, "No creator id was provided for this new activity"]
    }
}, { timestamps: true })


// PLUGINS


// MIDDLEWARE

// ActivitySchema.pre("save", async function save(next) {
// });

/* handles any errors when new Activity document can't be created */
// ActivitySchema.post("save", handleUserDocSaveErr);

const activityMethods: typeof ActivitySchema.methods & IActivityMethods = {
    ...ActivitySchema.methods,
    toActivityJSON
}

ActivitySchema.methods = activityMethods;

export const Activity = mongoose.model<IActivityDocument, IActivityModel>("Activity", ActivitySchema)
