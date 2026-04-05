import React, {useEffect} from "react";
import {Outlet, useNavigation} from "react-router-dom";
import {Header} from "../components/Header";
import {useLoader} from "../contexts/LoaderContext";
import {Spinner} from "@heroui/react";
import { useMetamaskSessionGuard } from "../hooks/useMetamaskSessionGuard";

export function RootLayout() {

    useMetamaskSessionGuard();
    const {isLoading} = useLoader();

    const navigation = useNavigation();

    if(navigation.state === "loading" || isLoading){
        return (
            <Spinner color={"primary"} className={"flex justify-center items-center"}/>
        );
    }

    return (
        <>
            <Header/>
            <main style={{padding: '1rem'}}>
                <Outlet/>
            </main>
        </>
    )
}