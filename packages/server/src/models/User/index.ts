import mongoose, { NativeError, Schema as ISchema, Model, Mongoose, Error, ErrorHandlingMiddlewareFunction } from "mongoose";
import bcrypt from "bcrypt";
import { RegexUtils } from "@activitytracker/common/src/utils";
import type { IUser, IUserDocument, IUserModel } from "@activitytracker/common/src/api/models/User.d";
import { generateAccessToken, generateRefreshToken, handleUserDocSaveErr, toFullUserJSON, toShallowUserJSON, validatePassword } from "./userMethods";

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
        type: String
    },
    jwtHash: String,
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

/* compare given password to encrypted password */
UserSchema.methods.validatePassword = validatePassword;

/* generate a web token for a given user */
UserSchema.methods.generateAccessToken = generateAccessToken;
UserSchema.methods.generateRefreshToken = generateRefreshToken;

UserSchema.methods.toShallowUserJSON = toShallowUserJSON;
UserSchema.methods.toFullUserJSON = toFullUserJSON;

export const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema)
