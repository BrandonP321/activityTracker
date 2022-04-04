import mongoose, {} from "mongoose";
import { BaseModelDocProps, ModelRefFields, ModelRefFieldType, PopulatedConditionalType, ResponseJSON, TDocument, TModel, TObjectId } from ".";
import { ActivityModel } from "./Activity.model";
import { UserModel } from "./User.model";

type ListRefFieldTypes = ModelRefFields<{
    TActivities: TObjectId | ActivityModel.Document | ActivityModel.FullResponseJSON;
    TUsers: TObjectId | UserModel.Document | UserModel.FullResponseJSON | UserModel.ShallowResponseJSON;
}>

export namespace ListModel {

    export type List<RefFields extends ListRefFieldTypes = {}> = BaseModelDocProps & {
        name: string;
        creatorId: string;
        activities: ModelRefFieldType<RefFields, "TActivities">[];
        users: ModelRefFieldType<RefFields, "TUsers">[];
    }

    export type Document<RefFields extends ListRefFieldTypes = {}> = TDocument<List<RefFields>, QueryHelpers, InstanceMethods<RefFields>>;
    
    export type Model<RefFields extends ListRefFieldTypes = {}> = TModel<Document<RefFields>, QueryHelpers, InstanceMethods<RefFields>>

    /* List model when all fields have been populated */
    export type AllPopulatedDoc = Document<{ TUsers: UserModel.Document; TActivities: ActivityModel.Document; }>;

    export type InstanceMethods<RefFields extends ListRefFieldTypes = {}> = {
        toListJSON: () => Promise<PopulatedConditionalType<RefFields["TActivities"], AllPopulatedFullResponseJSON, FullResponseJSON>>;
        populateAllFields: PopulatedConditionalType<RefFields["TActivities"], undefined, () => Promise<AllPopulatedDoc | undefined>>;
    }

    export type QueryHelpers = {
    }

    export type FullResponseJSON<RefFields extends ListRefFieldTypes = {}> = ResponseJSON<List<RefFields>>
    export type AllPopulatedFullResponseJSON = FullResponseJSON<{ TActivities: ActivityModel.FullResponseJSON; TUsers: UserModel.ShallowResponseJSON }>
}
