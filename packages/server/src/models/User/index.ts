import mongoose, { NativeError, Schema as ISchema } from "mongoose";
import bcrypt from "bcrypt";
import { RegexUtils } from "@activitytracker/common/src/utils/RegexUtils";
import type { IUser, IUserDocument, IUserMethods, IUserModel } from "@activitytracker/common/src/api/models/User.model";
import { generateAccessToken, generateRefreshToken, handleUserDocSaveErr, populateUserActivities, populateUserLists, toFullUserJSON, toPopulatedUserJSON, toShallowUserJSON, validatePassword } from "./userMethods";

const { Schema } = mongoose;

const UserSchema: ISchema<IUserDocument, IUserModel, IUserDocument> = new Schema({
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email Required"],
        match: [RegexUtils.emailRegex, "Email is invalid"],
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password Required"],
        match: [RegexUtils.passwordRegex, "Password is invalid"]
    },
    username: {
        type: String,
        required: [true, "Username Required"],
        unique: true,
        index: true
    },
    profileImg: {
        type: String
    },
    fullName: {
        type: String,
        required: [true, "Name Required"]
    },
    phone: {
        type: String,
        default: null
    },
    jwtHash: {
        type: Schema.Types.Mixed,
        default: {}
    },
    userActivities: {
        type: [mongoose.Types.ObjectId],
        ref: "Activity",
        default: []
    },
    savedActivities: {
        type: [mongoose.Types.ObjectId],
        ref: "Activity",
        default: []
    },
    lists: {
        type: [mongoose.Types.ObjectId],
        ref: "List",
        default: []
    },
}, { timestamps: true })


// PLUGINS

/* plugin for error handling of unique fields on schema */
// UserSchema.plugin(uniqueValidator, { message: "{PATH} is already taken." })


// MIDDLEWARE

/* hash password before storing it */
UserSchema.pre("save", async function save(next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);

        this.password = await bcrypt.hash(this.password, salt);

        return next();
    } catch (err) {
        if (err instanceof NativeError || err === null) {
            return next(err);
        }
    }
});

/* handles any errors when new User document can't be created */
UserSchema.post("save", handleUserDocSaveErr);

const userMethods: typeof UserSchema.methods & IUserMethods = {
    ...UserSchema.methods,
    validatePassword,
    generateAccessToken,
    generateRefreshToken,
    toShallowUserJSON,
    toFullUserJSON,
    populateUserActivities,
    toPopulatedUserJSON,
    populateUserLists
}

UserSchema.methods = userMethods;

export const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema)
