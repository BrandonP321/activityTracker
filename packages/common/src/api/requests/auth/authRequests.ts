import axios from "axios";
import { LoginUserRequest, RegisterUserRequest } from "./authRequests.types";
import { Routes } from "../../routes";
import { APIUtils } from "../../../utils/APIUtils";
import { APIRequest } from "..";
import { EnvUtils } from "../../../utils/EnvUtils";

// GET

// POST

const APIDomain = APIUtils.getApiDomain();

// axios.defaults.withCredentials = true;

export const RegisterUser: APIRequest<RegisterUserRequest.Request> = (urlParams, bodyParams) =>  {
    return axios.post(`${APIDomain}${Routes.RegisterUser(urlParams)}`, bodyParams);
}

export const LoginUser: APIRequest<LoginUserRequest.Request> = (urlParams, bodyParams) => {
    return axios.post(`${APIDomain}${Routes.LoginUser(urlParams)}`, bodyParams, { withCredentials: true });
}

// PUT

// DELETE