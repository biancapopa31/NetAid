import {SignOutButton, UserButton, useUser} from "@clerk/clerk-react";
import React, {useEffect} from "react";
import {NavLink, Outlet} from "react-router-dom";
import {useContracts} from "../contexts/ContractsContext";
import {Addressable, AddressLike} from "ethers";
import {useUserDetails} from "../contexts/UserDetailsContext";
import {Header} from "../components/Header";

export function HomePage() {
    const { user } = useUser();
    const primaryWeb3Wallet = user?.primaryWeb3Wallet;
    const {userProfileContract, postsContract} = useContracts();
    const {username, bio, profilePictureCdi, accountInitialized} = useUserDetails();

    return (
        <>
            <Header/>
            <main style={{padding: '1rem'}}>
                <Outlet/>
                <SignOutButton/>

            </main>
        </>
    )
}