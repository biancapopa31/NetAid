import {SignOutButton, UserButton, useUser} from "@clerk/clerk-react";
import React from "react";
import {NavLink, Outlet} from "react-router-dom";

export function HomePage() {
    const { user } = useUser()
    const primaryWeb3Wallet = user?.primaryWeb3Wallet
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