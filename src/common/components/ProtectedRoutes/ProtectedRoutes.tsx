import {Navigate, Outlet} from "react-router";
import {ReactNode} from "react";


type Props = {
    children?: ReactNode,
    isAllowed: boolean,
    redirectPath: string
}
export const ProtectedRoutes = ({children, isAllowed, redirectPath}:Props) => {
    if (!isAllowed){
        return <Navigate to={redirectPath}/>
    }

    return children || <Outlet/>
};
