import {SignOutButton, UserButton, useUser} from "@clerk/clerk-react";
import React, {useEffect} from "react";
import {NavLink, Outlet} from "react-router-dom";
import {useContracts} from "../contexts/ContractsContext";
import {useUserDetails} from "../contexts/UserDetailsContext";
import {Header} from "../components/Header";
import {useLoader} from "../contexts/LoaderContext";
import {Spinner} from "@heroui/react";

export function HomePage() {
    const { user } = useUser();
    const primaryWeb3Wallet = user?.primaryWeb3Wallet;
    const {userProfileContract, postsContract} = useContracts();
    const {username, bio, profilePictureCdi, accountInitialized, profilePictureUrl} = useUserDetails();

    const {isLoading} = useLoader();

    if(isLoading){
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