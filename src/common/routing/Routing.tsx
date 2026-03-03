import {Main} from "@/app/Main"
import {PageNotFound, ProtectedRoutes} from "@/common/components"
import {Login} from "@/features/auth/ui/Login/Login"
import {Route, Routes} from "react-router"
import {FAQ} from '@/app/FAQ.tsx'
import {useAppSelector} from "@/common/hooks";
import {selectIsLoggedIn} from "@/features/auth/model/auth-slice.ts";

export const Path = {
    Main: "/",
    Login: "/login",
    NotFound: "*",
    FAQ: "/faq",
} as const

export const Routing = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    return (
        <Routes>
            <Route element={<ProtectedRoutes isAllowed={isLoggedIn} redirectPath={Path.Login}/>}>
                <Route path={Path.Main} element={<Main/>}/>
                <Route path={Path.FAQ} element={<FAQ/>}/>
            </Route>

            <Route element={<ProtectedRoutes isAllowed={!isLoggedIn} redirectPath={Path.Main}/>}>
                <Route path={Path.Login} element={<Login/>}/>
            </Route>
            {/*<Route path={Path.Main} element={<ProtectedRoutes isAllowed={isLoggedIn} redirectPath={Path.Login}><Main/></ProtectedRoutes>}/>*/}
            {/*<Route path={Path.FAQ} element={<ProtectedRoutes isAllowed={isLoggedIn} redirectPath={Path.Login}><FAQ/></ProtectedRoutes>}/>*/}
            {/*<Route path={Path.Login} element={<ProtectedRoutes isAllowed={!isLoggedIn} redirectPath={Path.Main}><Login/></ProtectedRoutes>}/>*/}
            <Route path={Path.NotFound} element={<PageNotFound/>}/>

        </Routes>
    )
}
