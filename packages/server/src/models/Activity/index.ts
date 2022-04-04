import mongoose, { NativeError, Schema as ISchema } from "mongoose";
import bcrypt from "bcrypt";
import type { ActivityModel } from "@activitytracker/common/src/api/models/Activity.model";
import { toActivityJSON } from "./activityMethods";

const { Schema } = mongoose;

const ActivitySchema = new Schema<ActivityModel.Activity, ActivityModel.Model, ActivityModel.InstanceMethods, ActivityModel.QueryHelpers>({
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

const activityMethods: Required<ActivityModel.InstanceMethods> = {
    toActivityJSON
}

ActivitySchema.methods = {
    ...ActivitySchema.methods,
    ...activityMethods
};

export const Activity = mongoose.model<ActivityModel.Activity, ActivityModel.Model>("Activity", ActivitySchema)
