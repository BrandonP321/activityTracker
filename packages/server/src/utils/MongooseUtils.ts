import mongoose from "mongoose";

export class MongooseUtils {
    public static mongooseIdToString(id: mongoose.Types.ObjectId) {

    }

    public static idStringToMongooseId(id: string | undefined) {
        if (!id) {
            return undefined;
        }
        
        try {
            return new mongoose.Types.ObjectId(id);
        } catch (err) {
            return undefined;
        }
    }
}