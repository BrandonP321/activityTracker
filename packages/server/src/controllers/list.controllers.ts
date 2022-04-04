import { ControllerUtils } from "~Utils/ControllerUtils";
import db from "~Models"
import mongoose, { CallbackError } from "mongoose";
import { RouteController } from "./index";
import { ListUtils } from "@activitytracker/common/src/utils/ListUtils";
import { IAuthJWTResLocals } from "~Middleware/authJWT.middleware";
import { DBUpdateDoc, FoundDoc, MongooseUtils } from "~Utils/MongooseUtils";
import { AddActivityToListRequest, CreateListErrors, CreateListRequest, AddActivityToListErrors, GetListRequest, GetListErrors } from "@activitytracker/common/src/api/requests/list";
import { ListModel } from "@activitytracker/common/src/api/models/List.model";

const { controllerWrapper, respondWithErr, respondWithUnexpectedErr } = ControllerUtils;

export const CreateListController: RouteController<CreateListRequest.Request, IAuthJWTResLocals> = async (req, res) => {
    controllerWrapper(res, async () => {
        const userId = res.locals?.user?.id;
    
        // validate input from user
        const inputErr = ListUtils.validateCreationFields(req.body);
    
        if (inputErr) {
            return respondWithErr(CreateListErrors.Errors.InvalidInputType({ field: inputErr.field, errMsg: inputErr.msg }), res);
        }

        const listObj: Pick<ListModel.List, "creatorId" | "name" | "users"> = {
            creatorId: userId?.toString(),
            name: req.body.listName,
            users: [userId]
        }
        
        // create new list document in db
        db.List.create(listObj, async (err: CallbackError, list) => { 
            if (err || !list) {
                return respondWithUnexpectedErr(res, "An error occurred while attempting to add the new list to the database");
            }
    
            const listJSON = await list.toListJSON();

            // add list id to user's list of activities
            db.User.updateOne({ _id: userId }, { $push: { lists: list?._id } }, (err: CallbackError, doc: DBUpdateDoc) => {
                if (err) {
                    return respondWithUnexpectedErr(res, "Error occurred while updating user's activities list");
                } else if (doc?.modifiedCount === 0) {
                    return respondWithErr(CreateListErrors.Errors.CreatorUserNotFound(), res);
                } else if (!doc || !doc.acknowledged) {
                    return respondWithUnexpectedErr(res, "Error adding new list to user document");
                }

                res.json({ listId: listJSON.id }).end();
            })
        })
    })
}

export const GetListController: RouteController<GetListRequest.Request, IAuthJWTResLocals> = async (req, res) => {
    controllerWrapper(res, async () => {
        const userId = res.locals.user?.id;

        db.List.findById(req.params.listId, async (err: CallbackError, list: FoundDoc<ListModel.Document>) => {
            if (err) {
                return respondWithUnexpectedErr(res, "Error getting list from db");
            } else if (!list) {
                return respondWithErr(GetListErrors.Errors.ListNotFound(), res);
            }

            // make sure user getting list is a member of the list already
            const isUserInList = !!list.users?.find(u => u?.toString() === userId.toString());

            if (!isUserInList) {
                return respondWithErr(GetListErrors.Errors.UserNotInList(), res);
            }

            // populate user and activity fields for List
            const populatedList = await list.populateAllFields();

            if (!populatedList) {
                return respondWithUnexpectedErr(res, "Error populating list data");
            }

            // convert user & activity arrays to response JSON's
            const listUsers = await Promise.all(populatedList.users?.map(u => u?.toShallowUserJSON()));
            const listActivities = await Promise.all(populatedList.activities?.map(u => u?.toActivityJSON()));

            const listJSON = await populatedList.toListJSON();

            const listResponse: GetListRequest.Request["ResBody"] = {
                ...listJSON,
                users: listUsers,
                activities: listActivities
            }

            res.json(listResponse).end();
        })
    })
}

export const AddActivityToListController: RouteController<AddActivityToListRequest.Request, IAuthJWTResLocals> = async (req, res) => {
    const userId = res.locals?.user?.id;
    const activityId = MongooseUtils.idStringToMongooseId(req.body.activityId);
    const listId = MongooseUtils.idStringToMongooseId(req.body.listId);

    if (!activityId) {
        return respondWithErr(AddActivityToListErrors.Errors.ActivityNotFound(), res);
    } else if (!listId) {
        return respondWithErr(AddActivityToListErrors.Errors.ListNotFound(), res);
    }

    // get list of users for give list to verify that current user is a member of the list
    db.List.findById(listId, async (err: CallbackError, list: FoundDoc<ListModel.Document>) => {
        if (err) {
            return respondWithUnexpectedErr(res);
        } else if (!list) {
            return respondWithErr(AddActivityToListErrors.Errors.ListNotFound(), res);
        }

        // verify user adding activity is already a member of the List
        const isUserInList = !!list.users?.find(u => u.toString() === userId.toString());

        if (!isUserInList) {
            return respondWithErr(AddActivityToListErrors.Errors.UserNotInList(), res);
        }

        // add activity id to List's arr of activities
        const listActivities = list.activities ?? [];
        listActivities.push(activityId);
        list.activities = listActivities;

        // save list db document
        list.save();

        res.json({ listId: req.body.listId }).end();
    })
}