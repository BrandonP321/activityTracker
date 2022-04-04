import db from "~Models";
import { RouteController } from "~Controllers";
import { IAuthJWTResLocals } from "~Middleware/authJWT.middleware";
import { NativeError, CallbackError } from "mongoose";
import { UserModel } from "@activitytracker/common/src/api/models/User.model";
import { ControllerUtils } from "~Utils/ControllerUtils";
import { GetUserDashDataRequest, GetUserErrors, GetUserListsErrors, GetUserListsRequest, GetUserRequest } from "@activitytracker/common/src/api/requests/user";
import { FoundDoc } from "~Utils/MongooseUtils";

const { respondWithErr, respondWithUnexpectedErr, controllerWrapper } = ControllerUtils;

export const GetUserController: RouteController<GetUserRequest.Request, {}> = async (req, res) => {
    controllerWrapper(res, async () => {
        db.User.findById(req.params.id, async (err: NativeError, user: FoundDoc<UserModel.Document>) => {
            if (err) {
                return respondWithUnexpectedErr(res, "Error finding user");
            } else if (!user) {
                return respondWithErr(GetUserErrors.Errors.UserNotFound(), res);
            }
    
            try {
                const userJSON = await user.toFullUserJSON();
    
                return res.json(userJSON).end();
            } catch(err) {
                return respondWithUnexpectedErr(res, "Error converting user doc to JSON object");
            }
        })
    })
}

export const GetUserDashDataController: RouteController<GetUserDashDataRequest.Request, IAuthJWTResLocals> = async (req, res) => {
    controllerWrapper(res, async () => {
        const userId = res.locals.user?.id;

        db.User.findById(userId, async (err: NativeError, user: FoundDoc<UserModel.Document>) => {
            if (err) {
                return respondWithUnexpectedErr(res, "Error finding user");
            } else if (!user) {
                return respondWithErr(GetUserErrors.Errors.UserNotFound(), res);
            }

            // populate all fields on user doc
            const populatedDoc = await user.populateAllFields();
            const populatedJSON = await populatedDoc?.toFullUserJSON();

            if (!populatedJSON) {
                return respondWithUnexpectedErr(res, "Error populating user data");
            }

            const dashJSON: GetUserDashDataRequest.Request["ResBody"] = {
                ...populatedJSON,
                quickStats: {
                    friendsCount: 30,
                    listsCount: 30,
                    savedActivitiesCount: user.savedActivities?.length ?? 0,
                    userActivitiesCount: user.userActivities?.length ?? 0
                }
            }
        
            return res.json(dashJSON).end();
        })
    })
}

export const GetUserListsController: RouteController<GetUserListsRequest.Request, IAuthJWTResLocals> = async (req, res) => {
    controllerWrapper(res, async () => {
        const userId = res.locals.user?.id;

        db.User.findById(userId, async (err: CallbackError, user: FoundDoc<UserModel.Document>) => {
            if (err) {
                return respondWithUnexpectedErr(res, "Error retrieving user data");
            } else if (!user) {
                return respondWithErr(GetUserListsErrors.Errors.UserNotFound(), res);
            }

            const populatedUser = await user.populateUserLists();

            if (!populatedUser) {
                return respondWithUnexpectedErr(res, "Error populating list data");
            }

            const populatedLists = await Promise.all(populatedUser?.lists?.map(l => l.toListJSON()));

            res.json({ lists: populatedLists })
        })
    })
}

// POST

// PUT

// DELETE