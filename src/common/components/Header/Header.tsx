import {
    changeThemeModeAC,
    selectAppStatus,
    selectEmail,
    selectIsLoggedIn,
    selectThemeMode, setIsLoggedInAC,
} from "@/app/app-slice.ts"
import {useAppDispatch, useAppSelector} from "@/common/hooks"
import {containerSx} from "@/common/styles"
import {getTheme} from "@/common/theme"
import {NavButton} from "@/common/components/NavButton/NavButton"
import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import LinearProgress from "@mui/material/LinearProgress"
import {Link} from "react-router";
import {Path} from "@/common/routing";
import {useLogoutMutation} from "@/features/todolists/api/authApi.ts";
import {ResultCode} from "@/common/enums";
import {AUTH_TOKEN} from "@/common/constants";
import {baseApi} from "@/app/baseApi.ts";

export const Header = () => {
    const themeMode = useAppSelector(selectThemeMode)
    const status = useAppSelector(selectAppStatus)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const email = useAppSelector(selectEmail)
    const [logout] = useLogoutMutation()
    const dispatch = useAppDispatch()

    const theme = getTheme(themeMode)

    const changeMode = () => {
        dispatch(changeThemeModeAC({themeMode: themeMode === "light" ? "dark" : "light"}))
    }

    const logoutHandler = () => {
        logout()
            .then((res)=>{
            if (res.data?.resultCode === ResultCode.Success) {
                dispatch(setIsLoggedInAC({isLoggedIn: false}))
                localStorage.removeItem(AUTH_TOKEN)
            }
        })
            .then(()=>{
                dispatch(baseApi.util.invalidateTags(["Tasks", "Todolists"]))
            })
    }


    return (
        <AppBar position="static" sx={{mb: "30px"}}>
            <Toolbar>
                <Container maxWidth={"lg"} sx={containerSx}>
                    <IconButton color="inherit">
                        <MenuIcon/>
                    </IconButton>
                    <div>
                        {isLoggedIn && <>
                            <span>{email}</span>
                            <NavButton onClick={logoutHandler}>Logout</NavButton>
                        </>
                    }
                        <NavButton
                            component={Link}
                            to={Path.FAQ}
                            background={theme.palette.primary.dark}
                        >
                            FAQ
                        </NavButton>
                        <NavButton component={Link} to={Path.Main}
                                   background={theme.palette.primary.dark}>Main</NavButton>
                        <Switch color={"default"} onChange={changeMode}/>
                    </div>
                </Container>
            </Toolbar>
            {status === "loading" && <LinearProgress/>}
        </AppBar>
    )
}
