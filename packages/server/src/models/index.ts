import mongoose from "mongoose";
import { User } from "./User";

export const connectToMongoDb = () => {
    mongoose.connect(process.env.MONGODB_URI ?? "mongodb://localhost/activitytracker", {  })
}

export default {
    User
}