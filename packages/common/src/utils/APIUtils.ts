import { ConfigUtils } from "./ConfigUtils";
import { MasterConfig } from "../config";
import { APIRequest, APIRequestResponse } from "../api/requests";

export class APIUtils {
    public static getApiDomain = () => {
        return ConfigUtils.getParam(MasterConfig.ConnectionSettings.ClientAPIUrlString, "./env");
    }
}