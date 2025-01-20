import React, {Provider, ReactNode, useContext, useEffect, useState} from "react";
import {ethers, BrowserProvider, Network, Contract, Eip1193Provider, Signer, JsonRpcSigner} from "ethers";
import deployment from '../utils/deployment.json'
import UserProfile from "../abi/UserProfile.json";
import Post from "../abi/Post.json";
import Comment from "../abi/Comment.json";

interface ContractsProps {
    provider: BrowserProvider | null;
    setProvider:React.Dispatch<React.SetStateAction<BrowserProvider>>;
    signer: JsonRpcSigner | null;
    setSigner:React.Dispatch<React.SetStateAction<JsonRpcSigner>>;
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
    signer: null,
    setSigner: () => {},
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
    const [signer, setSigner] = useState<JsonRpcSigner>();
    const [userProfileContract, setUserProfileContract] = useState<Contract>();
    const [postsContract, setPostsContract] = useState<Contract>();
    const [commentsContract, setCommentsContract] = useState<Contract>();


    useEffect(() => {
        console.log("in Contracts context");

        const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
        console.log("Provider :", provider);
        setProvider(provider);

        getAndSetSigner(provider)
    }, []);

    useEffect(() => {
        if(signer){
            const userProfileAddress = deployment.UserProfile;
            const userProfileContract = new ethers.Contract(userProfileAddress, UserProfile, signer);
            setUserProfileContract(userProfileContract);

            const postAddress = deployment.Post;
            const postsContract = new ethers.Contract(postAddress, Post, signer);
            setPostsContract(postsContract);

            const commentAddress = deployment.Comment;
            const commentsContract = new ethers.Contract(commentAddress, Comment, signer);
            setCommentsContract(commentsContract);
        }
    }, [signer]);

    const getAndSetSigner = async (provider) => {
        const network = await provider.getNetwork();
        console.log("Connected to network:", network);

        const signer = await provider.getSigner();
        console.log("Signer:", signer);
        setSigner(signer);
    };


    return (
        <ContractsContext.Provider value={{
            provider, setProvider,
            signer, setSigner,
            userProfileContract,
            postsContract,
            commentsContract,
        } as ContractsProps}>
            {children}
        </ContractsContext.Provider>
    );
};

export const useContracts = () => useContext(ContractsContext);