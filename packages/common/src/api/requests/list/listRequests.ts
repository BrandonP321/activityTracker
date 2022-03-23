import axios, { AxiosResponse } from "axios";
import { ListRoutes, Routes, UserRoutes } from "../../routes";
import { APIRequest, APIRequestResponse, ProtectedAPIRequest, ProtectedRouteErrors } from "..";
import { APIUtils } from "../../../utils/APIUtils";
import { GetUserListsRequest } from "../user";
import { GetListRequest } from "./listRequests.types";

const APIDomain = APIUtils.getApiDomain();

export const GetList: APIRequest<GetListRequest.Request> = (urlParams, bodyParams, headers) => {
    return axios.get(`${APIDomain}${ListRoutes.GetList(urlParams)}`, {withCredentials: true})
}

// export const SearchForUser: APIRequest<UserSearchRequest> = (urlParams, bodyParams, headers) => {
//     return axios.get(`${APIDomain}${UserRoutes.UserSearch(urlParams)}`, { params: urlParams })
// }