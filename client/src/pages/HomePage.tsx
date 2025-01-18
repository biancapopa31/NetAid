import {SignOutButton, UserButton, useUser} from "@clerk/clerk-react";
import React, {useEffect} from "react";
import {NavLink, Outlet} from "react-router-dom";
import {useContracts} from "../contexts/ContractsContext";
import {Addressable, AddressLike} from "ethers";

export function HomePage() {
    const { user } = useUser()
    const primaryWeb3Wallet = user?.primaryWeb3Wallet
    const {userProfileContract} = useContracts()

    useEffect(() => {
        console.log("User profile in home0:", userProfileContract);
        f();

    }, [userProfileContract]);
    const f = async () =>{
        if(userProfileContract){
            const test = await userProfileContract.existsUser();
            console.log(test);
        }

    };


    return (
        <>
            <header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem',
                }}
            >
                <span>My first App</span>
                <UserButton/>
            </header>
            <main style={{padding: '1rem'}}>
                <Outlet/>
                <NavLink to={'/cacaca'}>Sug pula</NavLink>
                <NavLink to={'/pisu'}>Mananca pula</NavLink>
                <p>Address: {primaryWeb3Wallet ? primaryWeb3Wallet.web3Wallet : 'Not found'}</p>
                <SignOutButton/>

            </main>
        </>
    )
}