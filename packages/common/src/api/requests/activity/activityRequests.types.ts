import { APIErrResponse } from "..";
import { IBaseModelProperties } from "../../models";
import { IActivity, IActivityFullResponse, TToActivityJSON } from "../../models/Activity.model";
import { IPopulatedUserModel } from "../../models/User.model";
import { CreateActivityErrors } from "./activityRequests.errors";

export namespace CreateActivityRequest {

    export interface Request {
        UrlParams: {

        }
        ReqBody: {
            
        } & Omit<IActivity, keyof IBaseModelProperties>
        ResBody: {
            activityId: string;
        }
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof CreateActivityErrors.Errors>;
};

export namespace GetUserActivitiesRequest {

    export interface Request {
        UrlParams: {

        }
        ReqBody: {
            userId: string;
        }
        ResBody: {
            userActivities: IActivityFullResponse[];
            savedActivities: IActivityFullResponse[];
        }
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof CreateActivityErrors.Errors>;
};