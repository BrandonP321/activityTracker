import { LoginUserRequest, RefreshTokensRequest, RegisterUserRequest } from "../requests/auth.request.types";

/**
 * URL params but be identical to those in the request type in the
 * corresponding <route>.types.ts file in the common package
 */

export const AuthRoutes = {
    RegisterUser: (params?: RegisterUserRequest["UrlParams"]) => "/api/auth/register",
    LoginUser: (params?: LoginUserRequest["UrlParams"]) => "/api/auth/login",
    RefreshTokens: (params?: RefreshTokensRequest["UrlParams"]) => "/api/auth/refresh-tokens",
}

export const UserRoutes = {
    // GetAllUsers: (params?: GetAllUsersRequest["UrlParams"]) => "/api/user/all",
    // GetUser: (params?: GetUserRequest["UrlParams"]) => `/api/user/${params?.id ?? ":id"}`,
}


export const Routes = {
    ...AuthRoutes,
    ...UserRoutes,
}

export type ValidRoute = keyof typeof Routes;