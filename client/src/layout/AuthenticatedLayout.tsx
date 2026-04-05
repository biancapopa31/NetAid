import { useMetamaskSessionGuard } from "../hooks/useMetamaskSessionGuard";
import { Outlet } from "react-router-dom";

export const AuthenticatedLayout = () => {
    useMetamaskSessionGuard(); // 👈 runs once, guards entire app

    return <Outlet />;
};