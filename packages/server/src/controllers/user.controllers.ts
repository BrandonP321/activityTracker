import db from "~Models";
import { RouteController } from "~Controllers";
import { IAuthJWTResLocals } from "~Middleware/authJWT.middleware";
import { NativeError } from "mongoose";
import { IUserDocument, IUserModel } from "@activitytracker/common/src/api/models/User.model";
import { ControllerUtils } from "~Utils/ControllerUtils";
import { GetUserDashDataRequest, GetUserErrors, GetUserRequest } from "@activitytracker/common/src/api/requests/user";

const { respondWithErr, respondWithUnexpectedErr, controllerWrapper } = ControllerUtils;

export const GetUserController: RouteController<GetUserRequest.Request, {}> = async (req, res) => {
    controllerWrapper(res, async () => {
        db.User.findById(req.params.id, async (err: NativeError, user: IUserModel | null) => {
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
    const userId = res.locals.user?.id;

    controllerWrapper(res, async () => {
        db.User.findById(userId, async (err: NativeError, user: IUserModel | null) => {
            if (err) {
                return respondWithUnexpectedErr(res, "Error finding user");
            } else if (!user) {
                return respondWithErr(GetUserErrors.Errors.UserNotFound(), res);
            }

            // populate all fields on user doc
            const populatedJSON = await user.toPopulatedUserJSON();

            if (!populatedJSON) {
                return respondWithUnexpectedErr(res, "Error populating user data");
            }
        
            return res.json(populatedJSON).end();
        })
    })
}

// export const UserSearchController: RouteController<UserSearchRequest, {}> = async (req, res) => {
//     const { userInput } = req.query;
//     // create regex for wildcard search for user
//     const userRegex = new RegExp(`^${userInput ?? ""}`, "ig");

//     // make wildcard search for users with similar usernames
//     db.User.find({ username: userRegex }, async (err, users) => {
//         if (err || !users) {
//             return respondWithUnexpectedErr(res);
//         }

//         const formattedUsers = await Promise.all(users.map(u => u.toShallowUserJSON()));

//         res.json({
//             foundUsers: formattedUsers
//         }).end();
//     })

// }

// POST

// PUT

// DELETE