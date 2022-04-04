import mongoose, {} from "mongoose";
import { BaseModelDocProps, ModelRefFields, ModelRefFieldType, PopulatedConditionalType, ResponseJSON, TDocument, TModel, TObjectId } from ".";
import { ActivityModel } from "./Activity.model";
import { ListModel } from "./List.model";

type WithoutSensitiveData<T = {}> = Omit<T, "password" | "jwtHash">;

type UserRefFieldTypes = ModelRefFields<{
    TUserActivities: TObjectId | ActivityModel.Document | ActivityModel.FullResponseJSON;
    TSavedActivities: TObjectId | ActivityModel.Document | ActivityModel.FullResponseJSON;
    TLists: TObjectId | ListModel.Document | ListModel.FullResponseJSON;
}>

export namespace UserModel {

    export type User<RefFields extends UserRefFieldTypes = {}> = BaseModelDocProps & {
        email: string;
        password: string;
        fullName: string;
        username: string;
        profileImg: string;
        phone: string | null;
        /* random hash used to enforce refresh jwt's only being used once */
        jwtHash: { [key: string]: boolean; };
        /* activities created by the user */
        userActivities: ModelRefFieldType<RefFields, "TUserActivities">[];
        /* activities saved by the user */
        savedActivities: ModelRefFieldType<RefFields, "TSavedActivities">[];
        lists: ModelRefFieldType<RefFields, "TLists">[];
    }

    export type Document<RefFields extends UserRefFieldTypes = {}> = TDocument<User<RefFields>, QueryHelpers, InstanceMethods<RefFields>>;
    
    export type Model<RefFields extends UserRefFieldTypes = {}> = TModel<Document<RefFields>, QueryHelpers, InstanceMethods<RefFields>>

    /* User model when only both activity fields have been populated */
    export type AllActivitiesPopulatedDoc = Document<{ TUserActivities: ActivityModel.Document; TSavedActivities: ActivityModel.Document; }>;
    /* User model when only 'lists' field have been populated */
    export type ListsPopulatedDoc = Document<{ TLists: ListModel.Document }>;
    export type AllPopulatedDoc = Document<{ TLists: ListModel.Document; TSavedActivities: ActivityModel.Document; TUserActivities: ActivityModel.Document }>;

    export type InstanceMethods<RefFields extends UserRefFieldTypes = {}> = {
        populateActivities: PopulatedConditionalType<RefFields["TUserActivities"], undefined, () => Promise<AllActivitiesPopulatedDoc | undefined>>;
        toFullUserJSON: () => Promise<FullResponseJSON<RefFields>>;
        validatePassword: (password: string) => Promise<boolean>;
        generateAccessToken: (hash: string) => string | undefined;
        generateRefreshToken: (hash: string) => string | undefined;
        /* returns JSON object with basic user data */
        toShallowUserJSON: () => Promise<ShallowResponseJSON>;
        populateUserLists: PopulatedConditionalType<RefFields["TLists"], undefined, () => Promise<ListsPopulatedDoc | undefined>>;
        populateAllFields: PopulatedConditionalType<RefFields["TLists"], undefined, () => Promise<AllPopulatedDoc | undefined>>;
    }

    export type QueryHelpers = {
    }

    /* different response types for final JSON objects sent to client */
    export type FullResponseJSON<RefFields extends UserRefFieldTypes = {}> = ResponseJSON<WithoutSensitiveData<User<RefFields>>>
    export type ShallowResponseJSON<RefFields extends UserRefFieldTypes = {}> = ResponseJSON<WithoutSensitiveData<Pick<User<RefFields>, "createdAt" | "email" | "fullName" | "id" | "profileImg" | "username" | "createdAt" | "updatedAt">>>
    export type AllActivitiesPopulatedFullResponseJSON = FullResponseJSON<{ TUserActivities: ActivityModel.FullResponseJSON; TSavedActivities: ActivityModel.FullResponseJSON }>
    export type AllPopulatedFullResponseJSON = FullResponseJSON<{ TUserActivities: ActivityModel.FullResponseJSON; TSavedActivities: ActivityModel.FullResponseJSON; TLists: ListModel.FullResponseJSON }>
}