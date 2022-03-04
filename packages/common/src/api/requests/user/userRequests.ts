import axios, { AxiosResponse } from "axios";
import { Routes, UserRoutes } from "../../routes";
import { APIRequest, APIRequestResponse, ProtectedAPIRequest, ProtectedRouteErrors } from "..";
import { APIUtils } from "../../../utils/APIUtils";
import { GetUserRequest } from "./userRequests.types";

const APIDomain = APIUtils.getApiDomain();

export const GetUser: APIRequest<GetUserRequest.Request> = (urlParams, bodyParams) => {
    return axios.get(`${APIDomain}${Routes.GetUser(urlParams)}`, {withCredentials: true})
}

// export const SearchForUser: APIRequest<UserSearchRequest> = (urlParams, bodyParams, headers) => {
//     return axios.get(`${APIDomain}${UserRoutes.UserSearch(urlParams)}`, { params: urlParams })
// }