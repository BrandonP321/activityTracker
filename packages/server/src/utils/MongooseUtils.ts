import mongoose from "mongoose";

export type MongooseObjectId = mongoose.Types.ObjectId;

export type FoundDoc<Doc extends {}> = null | Doc;

export type PopulatedDoc<PopulatedType> = PopulatedType | MongooseObjectId;

export type DBUpdateDoc = {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId: null;
    upsertedCount: number;
    matchedCount: number;
}

export class MongooseUtils {
    public static mongooseIdToString(id: MongooseObjectId) {
        try {
            return id.toString();
        } catch (err) {
            return undefined;
        }
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