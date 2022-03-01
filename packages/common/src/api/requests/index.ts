import { AxiosResponse } from "axios";
import { RefreshTokens } from "./auth.requests";
import { RequestErrors } from "./RequestErrors";

export interface APIRequestResponse {
    UrlParams: {};
    ReqBody: {};
    ResBody: {};
    headers: {};
}

export type APIRequest<T extends APIRequestResponse> = (urlParams: T["UrlParams"], bodyParams: T["ReqBody"], headers: T["headers"]) => (
    Promise<AxiosResponse<T["ResBody"]>>
)

/* A protected API route attempts to refresh any expired accessTokens or execute client side code to have user re-auth if token is invalid */
export type ProtectedAPIRequest<T extends APIRequestResponse> = (
        urlParams: T["UrlParams"], 
        bodyParams: T["ReqBody"], 
        headers: T["headers"], 
        haveUserReAuth: () => void, 
        getRefreshToken: () => Promise<string | null>, 
        storeTokens: (at: string, rt: string) => Promise<boolean>
    ) => (
    Promise<AxiosResponse<T["ResBody"]>>
)

/* type of error thrown when a user needs to reauth due to not being able to to refresh their access token */
export type JWTAuthErrors = {
    error: typeof RequestErrors.UserMustReAuth | typeof RequestErrors.ExpiredAccessToken;
}

/* error response when an unexpected condition occurred on the server */
export type UnexpectedConditionErr = {
    error: typeof RequestErrors.UnexpectedCondition
}

export type ProtectedRouteErrors = JWTAuthErrors | UnexpectedConditionErr;

/**
 * This API route wrapper function attempts to hit a protected API endpoint, which would require the client to provide an access token.  
 * If the token is expired, this will attempt to refresh both the access & refresh tokens, and then also attempt to
 * hit the original API endpoint using the new token credentials.  If there are any problems authenticating the tokens or refreshing them, 
 * a custom client side function is executed to redirect the user to a login screen for re-authentication.
 * 
 * @param request API request client is attempting to make
 * @param params Body and Header params being passed in
 * @param haveUserReAuth Client side function to have user re-auth if access or refresh tokens are entirely invalid
 * @param getRefreshToken Client side function to get the client's refresh token
 * @param storeTokens Client side function to store access and refresh tokens after successfully refreshing them
 * @returns 
 */
export const ProtectedRouteWrapper: <T extends APIRequestResponse>(
    req: (params: { bodyParams?: T["ReqBody"]; headers?: T["headers"] }) => Promise<AxiosResponse<T["ResBody"]>>,
    params: { bodyParams?: T["ReqBody"]; headers?: T["headers"] },
    haveUserReAuth: () => void, getRefreshToken: () => Promise<string | null>,
    storeTokens: (a: string, r: string) => Promise<boolean>) => Promise<AxiosResponse<T["ResBody"]>> = (request, params, haveUserReAuth, getRefreshToken, storeTokens) => {
        return new Promise(async (resolve, reject) => {
            try {
                // attempt API request
                const res = await request(params);

                return resolve(res);
            } catch (err: any) {
                if (err?.response?.data?.error === RequestErrors.ExpiredAccessToken) {
                    // if access token is expired, attempt token refresh

                    // get refresh token from client side
                    const refreshToken = await getRefreshToken();

                    if (!refreshToken) {
                        return reject(haveUserReAuth())
                    }

                    try {
                        // make request for new tokens using refresh token from client
                        const { data: { accessToken: at, refreshToken: rt } } = await RefreshTokens({}, {}, { authorization: `Bearer ${refreshToken}` });

                        // store new tokens on client side
                        const tokensStored = await storeTokens(at, rt);

                        if (!tokensStored) {
                            return reject(haveUserReAuth());
                        }

                        // make another attempt at the initial API request using the new access token
                        const reattemptRes = await request({ ...params, headers: { authorization: `Bearer ${at}` } })

                        return resolve(reattemptRes);
                    } catch (err) {
                        // if token refresh fails for any reason, user must re-auth
                        return reject(haveUserReAuth());
                    }
                } else if (err?.response?.data?.error === RequestErrors.UserMustReAuth) {
                    // execute client side code to have user re-auth if token is invalid
                    return reject(haveUserReAuth())
                } else {
                    return reject(err);
                }
            }
        })
    }