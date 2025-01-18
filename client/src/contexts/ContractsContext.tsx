import React, {Provider, ReactNode, useContext, useEffect, useState} from "react";
import {ethers, BrowserProvider, Network, Contract, Eip1193Provider} from "ethers";
import deployment from '../utils/deployment.json'
import UserProfile from "../abi/UserProfile.json";
import Post from "../abi/Post.json";
import Comment from "../abi/Comment.json";

interface ContractsProps {
    provider: BrowserProvider | null;
    setProvider:React.Dispatch<React.SetStateAction<BrowserProvider>>;
    userProfileContract: Contract | null;
    setUserProfileContract:React.Dispatch<React.SetStateAction<Contract>>;
    postsContract: Contract | null;
    setPostsContract: React.Dispatch<React.SetStateAction<Contract>>;
    commentsContract: Contract | null;
    setCommentsContract: React.Dispatch<React.SetStateAction<Contract>>;

}

const initialState: ContractsProps = {
    provider: null,
    setProvider: () => {},
    userProfileContract: null,
    setUserProfileContract: () => {},
    postsContract: null,
    setPostsContract: () => {},
    commentsContract: null,
    setCommentsContract: () => {},

}

const ContractsContext = React.createContext<ContractsProps>(initialState);

interface ContractsProviderProps {
    children: ReactNode,
}

export const ContractsProvider: React.FC<ContractsProviderProps> = ({ children }) => {
    const [provider, setProvider] = useState<BrowserProvider>();
    const [userProfileContract, setUserProfileContract] = useState<Contract>();
    const [postsContract, setPostsContract] = useState<Contract>();
    const [commentsContract, setCommentsContract] = useState<Contract>();


    useEffect(() => {
        console.log("in Contracts context");

        const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
        setProvider(provider);
        console.log("Provider :", provider);

        const userProfileAddress = deployment.UserProfile;
        console.log("User Profile address:", userProfileAddress);
        const userProfileContract = new ethers.Contract(userProfileAddress, UserProfile, provider);
        setUserProfileContract(userProfileContract);
        console.log("User Profile contract:", userProfileContract);

        const postAddress = deployment.Post;
        const postsContract = new ethers.Contract(postAddress, Post, provider);
        setPostsContract(postsContract);

        const commentAddress = deployment.Comment;
        const commentsContract = new ethers.Contract(commentAddress, Comment, provider);
        setCommentsContract(commentsContract);
    }, []);


    return (
        <ContractsContext.Provider value={{
            provider, setProvider,
            userProfileContract, setUserProfileContract,
            postsContract, setPostsContract,
            commentsContract, setCommentsContract,
        } as ContractsProps}>
            {children}
        </ContractsContext.Provider>
    );
};

export const useContracts = () => useContext(ContractsContext);