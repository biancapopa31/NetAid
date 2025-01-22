import {useNavigate} from "react-router";
import {useUserDetails} from "../contexts/UserDetailsContext";
import React, {useEffect} from "react";
import {Spinner} from "@heroui/react";

export const DecisionPage = () => {
    const navigate = useNavigate();
    const {accountInitialized, setAccountInitialized, setBio, bio, username, setUsername} = useUserDetails();

    useEffect(() => {
        console.log("In decision page",accountInitialized);
        if(accountInitialized == null)
            return;
        if (accountInitialized){
            navigate('/home');
        }
        else{
            navigate('/newAccount');
        }
    }, [accountInitialized, navigate]);

    return (
        <Spinner color={"primary"} className={"flex justify-center items-center"}/>
    );
}