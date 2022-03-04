// import { GetAllUsersRequest, GetUserRequest } from "@activitytracker/common/src/api/requests/user.requests";
import db from "~Models";
import { RouteController } from "~Controllers";
import { IAuthJWTResLocals } from "~Middleware/authJWT.middleware";
import { NativeError } from "mongoose";
import { IUserDocument, IUserModel } from "@activitytracker/common/src/api/models/User.d";
import { ControllerUtils } from "~Utils/ControllerUtils";
import { GetUserErrors, GetUserRequest } from "@activitytracker/common/src/api/requests/user";
// GET

export const GetUserController: RouteController<GetUserRequest.Request, {}> = async (req, res) => {
    db.User.findById(req.params.id, async (err: NativeError, user: IUserModel | null) => {
        if (err) {
            return ControllerUtils.respondWithUnexpectedErr(res, "Error finding user");
        } else if (!user) {
            return ControllerUtils.respondWithErr(GetUserErrors.Errors.UserNotFound(), res);
        }

        try {
            const userJSON = await user.toFullUserJSON();

            return res.json(userJSON).end();
        } catch(err) {
            return ControllerUtils.respondWithUnexpectedErr(res, "Error converting user doc to JSON object");
        }

    })

}

// export const UserSearchController: RouteController<UserSearchRequest, {}> = async (req, res) => {
//     const { userInput } = req.query;
//     // create regex for wildcard search for user
//     const userRegex = new RegExp(`^${userInput ?? ""}`, "ig");

//     // make wildcard search for users with similar usernames
//     db.User.find({ username: userRegex }, async (err, users) => {
//         if (err || !users) {
//             return ControllerUtils.respondWithUnexpectedErr(res);
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