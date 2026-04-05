import React, { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useContracts, NonNullableContractsContextType } from "./ContractsContext";
import decodeInterface from "../interfaces/decode-interface";
import { UserProfile, userProfileKeys } from "../interfaces/UserProfile";
import { pinataService } from "../utils/pinataService";
import handleErrors from "../utils/errorHandler";
import { useClerk } from "@clerk/clerk-react";

interface UserDetails {
    accountInitialized: boolean | null;
    setAccountInitialized: React.Dispatch<React.SetStateAction<boolean | null>>;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    bio: string;
    setBio: React.Dispatch<React.SetStateAction<string>>;
    profilePictureCdi: string;
    setProfilePictureCdi: React.Dispatch<React.SetStateAction<string>>;
    profilePictureUrl: string;
    setProfilePictureUrl: React.Dispatch<React.SetStateAction<string>>;
    balance: number;
    setBalance: React.Dispatch<React.SetStateAction<string>>;
}

const initialState: UserDetails = {
    accountInitialized: null,
    setAccountInitialized: () => { },
    username: '',
    setUsername: () => { },
    bio: '',
    setBio: () => { },
    profilePictureCdi: `${process.env.REACT_APP_DEFAULT_AVATAR_CID}`,
    setProfilePictureCdi: () => { },
    profilePictureUrl: '',
    setProfilePictureUrl: () => { },
    balance: 0,
    setBalance: () => { },
}

const UserDetailsContext = React.createContext<UserDetails>(initialState);

interface UserDetailsProviderProps {
    children: ReactNode,
}

export const UserDetailsProvider: React.FC<UserDetailsProviderProps> = ({ children }) => {
    const [accountInitialized, setAccountInitialized] = useState<boolean | null>(null);
    const [username, setUsername] = useState<string>();
    const [bio, setBio] = useState<string>('');
    const [profilePictureCdi, setProfilePictureCdi] = useState<string>('');
    const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');
    const { userProfileContract, signer } = useContracts() as NonNullableContractsContextType;
    const [balance, setBalance] = useState<number>(0);
    const clerk = useClerk();

    const checkUser = useCallback(async () => {
        handleErrors(async () => {
            const exists = await userProfileContract.existsUser(signer.getAddress());
            setAccountInitialized(exists);
        }, {
            message: "Failed to check user profile. Please try again later. Hint: make sure you are connected to the correct Ethereum network and use a valid account.",
            onError: async (e) => {
                await clerk.signOut();
            }
        });
    }, [userProfileContract, signer, setAccountInitialized]);


    const fetchAndStoreUserDetails = useCallback(async () => {
        const response = await userProfileContract.getProfile(signer);
        const profile = decodeInterface<UserProfile>(userProfileKeys, response);

        setUsername(profile.username);
        setBio(profile.bio);
        setBalance(profile.balance);
        if (profile.profilePictureCid) {
            setProfilePictureCdi(profile.profilePictureCid);
            const profilePictureUrl = await pinataService.convertCid(profile.profilePictureCid);
            if (profilePictureUrl) {
                setProfilePictureUrl(profilePictureUrl);
            }
        } else {
            // TODO: remove hardcoding
            if (process.env.REACT_APP_DEFAULT_PROFILE_PICTURE) {
                setProfilePictureUrl(process.env.REACT_APP_DEFAULT_PROFILE_PICTURE);
            }
        }

    }, [userProfileContract, signer, setUsername, setBio, setProfilePictureUrl, setProfilePictureCdi]);

    useEffect(() => {
        if (accountInitialized) {
            fetchAndStoreUserDetails()
                .catch((err) => console.log(err));
        }
    }, [fetchAndStoreUserDetails, accountInitialized]);

    useEffect(() => {
        if (userProfileContract) {
            checkUser();
        }
    }, [signer, checkUser, userProfileContract]);

    return (
        <UserDetailsContext.Provider value={{
            accountInitialized, setAccountInitialized,
            username, setUsername,
            bio, setBio,
            profilePictureCdi, setProfilePictureCdi,
            profilePictureUrl, setProfilePictureUrl,
            balance,
        } as UserDetails}>
            {children}
        </UserDetailsContext.Provider>
    );
};

export const useUserDetails = () => useContext(UserDetailsContext);