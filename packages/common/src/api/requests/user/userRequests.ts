import axios, { AxiosResponse } from "axios";
import { UserRoutes } from "../../routes";
import { APIRequest } from "..";
import { APIUtils } from "../../../utils/APIUtils";
import { GetUserDashDataRequest, GetUserListsRequest, GetUserRequest } from "./userRequests.types";

const APIDomain = APIUtils.getApiDomain();

export const GetUser: APIRequest<GetUserRequest.Request> = (urlParams, bodyParams, headers) => {
    return axios.get(`${APIDomain}${UserRoutes.GetUser(urlParams)}`, {withCredentials: true})
}

export const GetUserDashData: APIRequest<GetUserDashDataRequest.Request> = (urlParams, bodyParams, headers) => {
    return axios.get(`${APIDomain}${UserRoutes.GetUserDashData(urlParams)}`, {withCredentials: true})
}

export const GetUserLists: APIRequest<GetUserListsRequest.Request> = (urlParams, bodyParams, headers) => {
    return axios.get(`${APIDomain}${UserRoutes.GetUserLists(urlParams)}`, {withCredentials: true})
}

// export const SearchForUser: APIRequest<UserSearchRequest> = (urlParams, bodyParams, headers) => {
//     return axios.get(`${APIDomain}${UserRoutes.UserSearch(urlParams)}`, { params: urlParams })
// }