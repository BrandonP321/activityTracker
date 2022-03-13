import { CreateActivityRequest, GetUserActivitiesRequest } from "../requests/activity";
import { LoginUserRequest, RegisterUserRequest } from "../requests/auth";
import { CreateListRequest } from "../requests/list";
import { GetUserDashDataRequest, GetUserRequest } from "../requests/user/userRequests.types";

/**
 * URL params but be identical to those in the request type in the
 * corresponding <route>.types.ts file
 */

export const AuthRoutes = {
    RegisterUser: (params?: RegisterUserRequest.Request["UrlParams"]) => "/api/auth/register",
    LoginUser: (params?: LoginUserRequest.Request["UrlParams"]) => "/api/auth/login",
}

export const UserRoutes = {
    GetUserDashData: (params?: GetUserDashDataRequest.Request["UrlParams"]) => "/api/user/dash/all",
    GetUser: (params?: GetUserRequest.Request["UrlParams"]) => `/api/user/${params?.id ?? ":id"}`,
    // UserSearch: (params?: UserSearchRequest["UrlParams"]) => `/api/user/search`
}

export const ActivityRoutes = {
    CreateActivity: (params?: CreateActivityRequest.Request["UrlParams"]) => `/api/activity/create`,
    GetUserActivities: (params?: GetUserActivitiesRequest.Request["UrlParams"]) => `/api/activity/user/activities`,
}

export const ListRoutes = {
    CreateList: (params?: CreateListRequest.Request["UrlParams"]) => `/api/list/create`,
}


export const Routes = {
    ...AuthRoutes,
    ...UserRoutes,
    ...ActivityRoutes,
    ...ListRoutes,
}

export type ValidRoute = keyof typeof Routes;