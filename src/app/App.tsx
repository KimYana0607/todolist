import "./App.module.css"
import {selectThemeMode} from "@/app/app-slice"
import {ErrorSnackbar, Header} from "@/common/components"
import {useAppDispatch, useAppSelector} from "@/common/hooks"
import {Routing} from "@/common/routing"
import {getTheme} from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import {ThemeProvider} from "@mui/material/styles"
import {meTC} from "@/features/auth/model/auth-slice.ts";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import s from '../app/App.module.css'

export const App = () => {

    const [init, setInit] = useState(false)
    const themeMode = useAppSelector(selectThemeMode)
    const theme = getTheme(themeMode)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(meTC()).finally(() => {
            setInit(true)
        })
    }, [])

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
