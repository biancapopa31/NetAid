import React, { createContext, useContext, useEffect, useState } from 'react';
import {Eip1193Provider, ethers} from 'ethers';
import deployment from '../utils/deployment.json';
import userProfileAbi from '../abi/UserProfile.json';
import postAbi from '../abi/Post.json';
import commentAbi from '../abi/Comment.json';
import donationAbi from '../abi/Donation.json';

const ContractsContext = createContext(null);

export const ContractsProvider = ({ children }: { children: React.ReactNode }) => {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [userProfileContract, setUserProfileContract] = useState<ethers.Contract | null>(null);
    const [postsContract, setPostsContract] = useState<ethers.Contract | null>(null);
    const [commentsContract, setCommentsContract] = useState<ethers.Contract | null>(null);
    const [donationContract, setDonationContract] = useState<ethers.Contract | null>(null);


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
            const userProfileContract = new ethers.Contract(userProfileAddress, userProfileAbi, signer);
            setUserProfileContract(userProfileContract);

            const postAddress = deployment.Post;
            const postsContract = new ethers.Contract(postAddress, postAbi, signer);
            setPostsContract(postsContract);

            const commentAddress = deployment.Comment;
            const commentsContract = new ethers.Contract(commentAddress, commentAbi, signer);
            setCommentsContract(commentsContract);

            const donationAddress = deployment.Donation;
            const donationContract = new ethers.Contract(donationAddress, donationAbi, signer);
            setDonationContract(donationContract);
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
            donationContract,
        }}>
            {children}
        </ContractsContext.Provider>
    );
};

export const useContracts = () => useContext(ContractsContext);