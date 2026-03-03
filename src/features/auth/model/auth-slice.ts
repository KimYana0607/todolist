import {LoginInputs} from "@/features/auth/lib/schemas";
import {createAppSlice, handleServerAppError, handleServerNetworkError} from "@/common/utils";
import {authApi} from "@/features/todolists/api/authApi.ts";
import {setAppStatusAC} from "@/app/app-slice.ts";
import {ResultCode} from "@/common/enums";

export const authSlice = createAppSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        email: '',
    },
    selectors: {
        selectIsLoggedIn: (state) => state.isLoggedIn,
        selectEmail: (state) => state.email,
    },
    reducers: create => ({
        loginTC: create.asyncThunk(
            async (data: LoginInputs, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(setAppStatusAC({status: 'loading'}))
                    const res = await authApi.login(data)
                    if (res.data.resultCode === ResultCode.Success) {
                        dispatch(setAppStatusAC({status: 'succeeded'}))
                        localStorage.setItem('token', res.data.data.token)
                        dispatch(meTC())
                        return {isLoggedIn: true}
                    } else {
                        handleServerAppError(res.data, dispatch)
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    handleServerNetworkError(dispatch, error)
                    return rejectWithValue(null)
                }
            },
            {
                pending: (state) => {
                    state.isLoggedIn = false
                    state.email = ""
                }
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload.isLoggedIn
                    state.email = ""
                },
            }
        ),

        logoutTC: create.asyncThunk(
            async (_arg, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(setAppStatusAC({status: 'loading'}))
                    const res = await authApi.logout()
                    if (res.data.resultCode === ResultCode.Success) {
                        dispatch(setAppStatusAC({status: 'succeeded'}))
                        localStorage.removeItem('token')
                        return {isLoggedIn: false}
                    } else {
                        handleServerAppError(res.data, dispatch)
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    handleServerNetworkError(dispatch, error)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload.isLoggedIn
                },
            }
        ),
        meTC: create.asyncThunk(
            async (_arg, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(setAppStatusAC({status: 'loading'}))
                    const res = await authApi.me()
                    if (res.data.resultCode === ResultCode.Success) {
                        dispatch(setAppStatusAC({status: 'succeeded'}))
                        return {isLoggedIn: true, email: res.data.data.login}
                    } else {
                        handleServerAppError(res.data, dispatch)
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    handleServerNetworkError(dispatch, error)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload.isLoggedIn
                    state.email = action.payload.email
                }
            }
        )
    }),
})

export const {selectIsLoggedIn, selectEmail} = authSlice.selectors
export const {loginTC, logoutTC, meTC} = authSlice.actions
export const authReducer = authSlice.reducer