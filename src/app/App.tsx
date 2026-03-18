import "./App.module.css"
import {selectThemeMode, setIsLoggedInAC} from "@/app/app-slice"
import {ErrorSnackbar, Header} from "@/common/components"
import {useAppDispatch, useAppSelector} from "@/common/hooks"
import {Routing} from "@/common/routing"
import {getTheme} from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import {ThemeProvider} from "@mui/material/styles"
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import s from '../app/App.module.css'
import {useMeQuery} from "@/features/todolists/api/authApi.ts";
import {ResultCode} from "@/common/enums";

export const App = () => {

    const [init, setInit] = useState(false)
    const themeMode = useAppSelector(selectThemeMode)

    const {data, isLoading} = useMeQuery()

    const theme = getTheme(themeMode)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isLoading) return
        if (data?.resultCode === ResultCode.Success) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
        }
        setInit(true)
    }, [isLoading]);

    if (!init) {
        return (
            <div className={s.circularProgressContainer}>
                <CircularProgress size={150} thickness={3}/>
            </div>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <div className={s.app}>
                <CssBaseline/>
                <Header/>
                <Routing/>
                <ErrorSnackbar/>
            </div>
        </ThemeProvider>
    )
}
