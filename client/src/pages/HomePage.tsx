import {SignOutButton, UserButton, useUser} from "@clerk/clerk-react";
import React, {useEffect} from "react";
import {NavLink, Outlet} from "react-router-dom";
import {useContracts} from "../contexts/ContractsContext";
import {Addressable, AddressLike} from "ethers";

export function HomePage() {
    const { user } = useUser()
    const primaryWeb3Wallet = user?.primaryWeb3Wallet
    const {userProfileContract, postsContract} = useContracts()

    useEffect(() => {
        console.log("User profile in home0:", userProfileContract);
        console.log("Post contract in home0:", postsContract);
        f();

    }, [userProfileContract, postsContract]);
    const f = async () =>{
        if(userProfileContract){
            const test = await userProfileContract.existsUser();
            console.log("Exist user in", test);
        }
        if(postsContract){
            console.log("in if", postsContract);
            // const test = await postsContract.getAllPosts();
            console.log(await postsContract.getAllPosts());
            // postsContract.getAllPosts().then((posts) => {
            //     console.log("pusi",posts);
            // }).catch((err) => {
            //     console.error(err);
            // })
            // console.log("apel la postsContract",test);
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