import {SignOutButton, UserButton, useUser} from "@clerk/clerk-react";
import React, {useEffect} from "react";
import {Outlet} from "react-router-dom";
import {Header} from "../components/Header";
import {useLoader} from "../contexts/LoaderContext";
import {Spinner} from "@heroui/react";
import {Bounce, ToastContainer} from "react-toastify";

export function HomePage() {
    const { user } = useUser();

    const {isLoading} = useLoader();

    if(isLoading){
        return (
            <Spinner color={"primary"} className={"flex justify-center items-center"}/>
        );
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <Header/>
            <main style={{padding: '1rem'}}>
                <Outlet/>
            </main>
        </>
    )
}