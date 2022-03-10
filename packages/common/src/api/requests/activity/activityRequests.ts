import axios, { AxiosResponse } from "axios";
import { Routes, UserRoutes } from "../../routes";
import { APIRequest, APIRequestResponse, ProtectedAPIRequest, ProtectedRouteErrors } from "..";
import { APIUtils } from "../../../utils/APIUtils";
import { GetUserActivitiesRequest } from "./activityRequests.types";

const APIDomain = APIUtils.getApiDomain();

export const GetUserActivities: APIRequest<GetUserActivitiesRequest.Request> = (urlParams, bodyParams, headers) => {
    return axios.get(`${APIDomain}${Routes.GetUserActivities(urlParams)}`, {withCredentials: true})
}

// export const SearchForUser: APIRequest<UserSearchRequest> = (urlParams, bodyParams, headers) => {
//     return axios.get(`${APIDomain}${UserRoutes.UserSearch(urlParams)}`, { params: urlParams })
// }