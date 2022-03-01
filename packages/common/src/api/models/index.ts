import mongoose from "mongoose";

export interface IBaseModelProperties {
    _id: mongoose.Types.ObjectId,
    createdAt: string;
    updatedAt: string;
}