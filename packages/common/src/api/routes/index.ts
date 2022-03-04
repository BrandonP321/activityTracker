import { LoginUserRequest, RegisterUserRequest } from "../requests/auth";
import { GetUserRequest } from "../requests/user/userRequests.types";

/**
 * URL params but be identical to those in the request type in the
 * corresponding <route>.types.ts file
 */

export const AuthRoutes = {
    RegisterUser: (params?: RegisterUserRequest.Request["UrlParams"]) => "/api/auth/register",
    LoginUser: (params?: LoginUserRequest.Request["UrlParams"]) => "/api/auth/login",
}

export const UserRoutes = {
    // GetAllUsers: (params?: GetAllUsersRequest["UrlParams"]) => "/api/user/all",
    GetUser: (params?: GetUserRequest.Request["UrlParams"]) => `/api/user/${params?.id ?? ":id"}`,
    // UserSearch: (params?: UserSearchRequest["UrlParams"]) => `/api/user/search`
}


export const Routes = {
    ...AuthRoutes,
    ...UserRoutes,
}

export type ValidRoute = keyof typeof Routes;