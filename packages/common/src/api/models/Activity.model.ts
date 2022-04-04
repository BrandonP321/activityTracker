import mongoose, { Model } from "mongoose";
import { BaseModelDocProps, ModelRefFields, ResponseJSON, TDocument, TModel } from ".";

type ActivityRefFieldTypes = ModelRefFields<{

}>

export namespace ActivityModel {

    export type Activity<RefFields extends ActivityRefFieldTypes = {}> = BaseModelDocProps & {
        name: string;
        tags: string[];
        price: number | null;
        numbPeople: {
            amount: number | null;
            orLess: boolean;
            orMore: boolean;
        }
        location: string | null;
        url: string | null;
        creatorId: string;
    }

    export type Document<RefFields extends ActivityRefFieldTypes = {}> = TDocument<Activity<RefFields>, QueryHelpers, InstanceMethods<RefFields>>;
    
    export type Model<RefFields extends ActivityRefFieldTypes = {}> = TModel<Document<RefFields>, QueryHelpers, InstanceMethods<RefFields>>

    /* Activity model when all fields have been populated */
    export type AllPopulatedDoc = Document<{  }>;

    export type InstanceMethods<RefFields extends ActivityRefFieldTypes = {}> = {
        toActivityJSON: () => Promise<FullResponseJSON<RefFields>>;
    }

    export type QueryHelpers = {
    }

    export type FullResponseJSON<RefFields extends ActivityRefFieldTypes = {}> = ResponseJSON<Activity<RefFields>>
    export type AllPopulatedFullResponseJSON = FullResponseJSON<{  }>
}