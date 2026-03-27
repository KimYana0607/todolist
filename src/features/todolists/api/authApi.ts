import {baseApi} from "@/app/baseApi";
import {BaseResponse} from "@/common/types";
import {LoginInputs} from "@/features/auth/lib/schemas";

export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<BaseResponse<{ userId: number, token: string }>, LoginInputs>({
            query: (body) => ({method: 'POST', url: '/auth/login', body})
        }),
        logout: build.mutation<BaseResponse, void>({
            query: () => ({method: 'DELETE', url: '/auth/login'}),
        }),
        me: build.query<BaseResponse<{ id: number, email: string, login: string }>, void>({
            query: () => ({method: 'GET', url: '/auth/me'}),
        }),
        getCaptcha: build.query<{url:string}, void>({
            query: () => '/security/get-captcha-url'
        })
    })
})

export const {useLoginMutation, useLogoutMutation, useMeQuery, useLazyGetCaptchaQuery} = authApi
