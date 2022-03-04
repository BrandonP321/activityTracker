import { ConfigUtils } from "./ConfigUtils";
import { MasterConfig } from "../config";

export class APIUtils {
    public static getApiDomain = () => {
        return ConfigUtils.getParam(MasterConfig.ConnectionSettings.ClientAPIUrlString, "./env");
    }
}