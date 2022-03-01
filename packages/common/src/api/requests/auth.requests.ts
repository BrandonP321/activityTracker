import axios from "axios";
import { LoginUserRequest, RefreshTokensRequest, RegisterUserRequest } from "./auth.request.types";
import { Routes } from "../routes";
import { APIUtils } from "../../utils/APIUtils";
import { APIRequest } from ".";

// GET

// POST

const APIDomain = APIUtils.getApiDomain();

export const RegisterUser: APIRequest<RegisterUserRequest> = (urlParams, bodyParams) =>  {
    return axios.post(`${APIDomain}${Routes.RegisterUser(urlParams)}`, bodyParams);
}

export const LoginUser: APIRequest<LoginUserRequest> = (urlParams, bodyParams) => {
    return axios.post(`${APIDomain}${Routes.LoginUser(urlParams)}`, bodyParams);
}

export const RefreshTokens: APIRequest<RefreshTokensRequest> = (urlParams, bodyParams, headers) => {
    return axios.post(`${APIDomain}${Routes.RefreshTokens(urlParams)}`, bodyParams, { headers });
}

// PUT

// DELETE