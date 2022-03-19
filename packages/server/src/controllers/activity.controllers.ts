import { ControllerUtils } from "~Utils/ControllerUtils";
import db from "~Models"
import mongoose, { CallbackError } from "mongoose";
import { RouteController } from "./index";
import { ActivityUtils } from "@activitytracker/common/src/utils/ActivityUtils";
import { CreateActivityErrors, CreateActivityRequest, GetUserActivitiesErrors, GetUserActivitiesRequest } from "@activitytracker/common/src/api/requests/activity";
import { IAuthJWTResLocals } from "~Middleware/authJWT.middleware";
import { IUserDocument } from "@activitytracker/common/src/api/models/User.model";
import { DBUpdateDoc, FoundDoc, MongooseUtils } from "~Utils/MongooseUtils";
import { AddActivityToListController } from "./list.controllers";

const { controllerWrapper, respondWithErr, respondWithUnexpectedErr } = ControllerUtils;

export const CreateActivityController: RouteController<CreateActivityRequest.Request, IAuthJWTResLocals> = async (req, res) => {
    controllerWrapper(res, async () => {
        const userId = res.locals?.user?.id;
    
        // validate input from user
        const inputErr = ActivityUtils.validateCreationFields(req.body);
    
        if (inputErr) {
            return respondWithErr(CreateActivityErrors.Errors.InvalidInputType({ field: inputErr.field, errMsg: inputErr.msg }), res);
        }
        
        // create new activity document in db
        db.Activity.create(req.body, async (err: CallbackError, activity) => { 
            if (err || !activity) {
                return respondWithUnexpectedErr(res, "An error occurred while attempting to add the new activity to the database");
            }
    
            const activityJSON = await activity.toActivityJSON();

            // add activity id to user's list of activities
            db.User.updateOne({ _id: userId }, { $push: { userActivities: activity?._id } }, (err: CallbackError, doc: DBUpdateDoc) => {
                if (err) {
                    return respondWithUnexpectedErr(res, "Error occurred while updating user's activities list");
                } else if (doc?.modifiedCount === 0) {
                    return respondWithErr(CreateActivityErrors.Errors.UserNotFound(), res);
                } else if (!doc || !doc.acknowledged) {
                    return respondWithUnexpectedErr(res, "Error adding new activity to user document");
                }

                // if list id was provided, add activity to specified list
                if (req.body.listId) {
                    const newReq: any = {
                        ...req,
                        body: {
                            listId: req.body.listId,
                            activityId: activity.id
                        }
                    }

                    return AddActivityToListController(newReq, res);
                } else {
                    res.json({ activityId: activityJSON.id }).end();
                }

            })
    
        })
    })
}

export const GetUserActivitiesController: RouteController<GetUserActivitiesRequest.Request, IAuthJWTResLocals> = async (req, res) => {
    controllerWrapper(res, async () => {
        const userId = res.locals?.user?.id;
        
        db.User.findById(userId, async (err: CallbackError, user: FoundDoc<IUserDocument>) => {
            if (err) {
                return respondWithUnexpectedErr(res, "Error finding user in database");
            } else if (!user) {
                return respondWithErr(GetUserActivitiesErrors.Errors.UserNotFound(), res);
            }

            const populated = await user.populateUserActivities();

            if (!populated) {
                return respondWithUnexpectedErr(res, "Error populating data for user's activities");
            }

            const activitiesJSON: GetUserActivitiesRequest.Request["ResBody"] = {
                userActivities: await Promise.all(populated.userActivities.map((a) => a.toActivityJSON())),
                savedActivities: await Promise.all(populated.savedActivities.map((a) => a.toActivityJSON())),
            }

            res.json(activitiesJSON).end();
        })
    })
}
