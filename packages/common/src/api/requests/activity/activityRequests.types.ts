import { APIErrResponse } from "..";
import { BaseModelDocProps } from "../../models";
import { ActivityModel } from "../../models/Activity.model";
import {  } from "../../models/User.model";
import { AddActivityToListRequest } from "../list";
import { CreateActivityErrors } from "./activityRequests.errors";

export namespace CreateActivityRequest {

    export interface Request {
        UrlParams: {

        }
        ReqBody: {
            /* optional list id if activity is also being added to a List on creation */
            listId?: string;
        } & ActivityModel.FullResponseJSON
        ResBody: {
            activityId: string;
        } | {
            // list id is returned if activity is also being added to a list
            listId: string;
        }
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof CreateActivityErrors.Errors> & AddActivityToListRequest.ErrResponse;
};

export namespace GetUserActivitiesRequest {

    export interface Request {
        UrlParams: {

        }
        ReqBody: {
            userId: string;
        }
        ResBody: {
            userActivities: ActivityModel.FullResponseJSON[];
            savedActivities: ActivityModel.FullResponseJSON[];
        }
        headers: {
            
        }
    }

    export type ErrResponse = APIErrResponse<typeof CreateActivityErrors.Errors>;
};