import React, { createContext, JSX, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Spinner } from "@heroui/react";
import { Eip1193Provider, ethers } from 'ethers';
import deployment from '../utils/deployment.json';
import userProfileAbi from '../abi/UserProfile.json';
import postAbi from '../abi/Post.json';
import commentAbi from '../abi/Comment.json';
import donationAbi from '../abi/Donation.json';
import handleErrors from '../utils/errorHandler';
import { h } from '@clerk/clerk-react/dist/useAuth-fq1pQd_y';
import { toast } from 'react-toastify';
import { useClerk } from '@clerk/clerk-react';

interface ContractsContextType {
    provider: ethers.BrowserProvider | null;
    setProvider: React.Dispatch<React.SetStateAction<ethers.BrowserProvider | null>>;
    signer: ethers.Signer | null;
    setSigner: React.Dispatch<React.SetStateAction<ethers.Signer | null>>;
    userProfileContract: ethers.Contract | null;
    postsContract: ethers.Contract | null;
    commentsContract: ethers.Contract | null;
    donationContract: ethers.Contract | null;
}

export type NonNullableContractsContextType = {
    [P in keyof ContractsContextType]: NonNullable<ContractsContextType[P]>;
}

const ContractsContext = createContext<ContractsContextType | null>(null);



export const ContractsSpinner = ({ children }: { children: React.ReactNode }) => {
    const {
        provider,
        signer,
        userProfileContract,
        postsContract,
        commentsContract,
        donationContract
    } = useContracts() as ContractsContextType;

    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        async function checkReady() {
            if (!provider || !signer) return;
            const contracts = [userProfileContract, postsContract, commentsContract, donationContract];
            if (contracts.some(c => c === null)) return;

            try {
                for (const contract of contracts) {
                    const code = await provider.getCode(contract!.target);
                    if (code === "0x") {
                        console.log("Contract not deployed at address", contract!.target);
                        return;
                    }
                }

                setReady(true);
            } catch (e) {
                console.error(e);
            }
        }

        checkReady();
    }, [provider, signer, userProfileContract, postsContract, commentsContract, donationContract]);

    if (!ready) {
        return (
            <Spinner color={"primary"} className={"flex justify-center items-center"} />

        );
    }

    return <>{children}</>;
};

export const ContractsProvider = ({ children }: { children: React.ReactNode }) => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [userProfileContract, setUserProfileContract] = useState<ethers.Contract | null>(null);
    const [postsContract, setPostsContract] = useState<ethers.Contract | null>(null);
    const [commentsContract, setCommentsContract] = useState<ethers.Contract | null>(null);
    const [donationContract, setDonationContract] = useState<ethers.Contract | null>(null);
    const clerk = useClerk();

    useEffect(() => {
        console.log("in Contracts context");

        if (typeof window !== 'undefined' && (window as any).ethereum) {
            handleErrors(async () => {

                const isUnlocked = await window.ethereum._metamask.isUnlocked();
                console.log("MetaMask unlocked:", isUnlocked);
                if (!isUnlocked) {
                    console.log("MetaMask is locked");
                    return;
                }

                const browserProvider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
                console.log("Browser provider initialized:", browserProvider);
                if (!browserProvider) {
                    console.error("Failed to initialize browser provider");
                    return;
                }
                setProvider(browserProvider);

                const network = await browserProvider.getNetwork();
                console.log("Connected to network:", network); // TODO: check if network is correct

                await getAndSetSigner(browserProvider);
            }, { message: "Failed to connect to Ethereum provider. Please make sure you have MetaMask installed and connected." });
        } else {
            toast.error("Ethereum provider not found. Please make sure you have MetaMask installed and are using a compatible browser.");
            console.error('window.ethereum is not available');
        }
    }, []);

    useEffect(() => {
        if (signer) {
            handleErrors(() => {
                const userProfileAddress = deployment.UserProfile;
                const userProfileContract = new ethers.Contract(userProfileAddress, userProfileAbi, signer);
                setUserProfileContract(userProfileContract);

                const postAddress = deployment.Post;
                const postsContract = new ethers.Contract(postAddress, postAbi, signer);
                console.log("posts contract", postsContract);
                setPostsContract(postsContract);

                const commentAddress = deployment.Comment;
                const commentsContract = new ethers.Contract(commentAddress, commentAbi, signer);
                setCommentsContract(commentsContract);

                const donationAddress = deployment.Donation;
                const donationContract = new ethers.Contract(donationAddress, donationAbi, signer);
                setDonationContract(donationContract);
            }, "Failed to initialize contracts. Please make sure you are connected to the correct Ethereum network.");
        }
    }, [signer]);

    const getAndSetSigner = async (provider: ethers.BrowserProvider) => {
        handleErrors(async () => {

            const accounts = await provider.send("eth_accounts", [])
            console.log("Accounts:", accounts);
            if (accounts.length === 0) {
                throw new Error("No accounts found. Please connect your wallet.");
                // show "Connect Wallet" button
            } else {
                const signer = await provider.getSigner()
                console.log("Signer:", signer);
                setSigner(signer);
            }

        }, {
            message: "Failed to get signer from provider. Please make sure you are connected to the correct Ethereum network.",
            onError: async (e) => {
                await clerk.signOut();
            }
        });
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

export const useContracts = () => {
    const ctx = useContext(ContractsContext);
    if (!ctx) {
        throw new Error('useContracts must be used within a ContractsProvider');
    }
    return ctx;
};  