import React, {ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {useUser} from "@clerk/clerk-react";
import {useContracts} from "./ContractsContext";
import {ethers} from "ethers";
import {pinata} from "../utils/config";

interface UserDetails {
    accountInitialized: boolean|null;
    setAccountInitialized: React.Dispatch<React.SetStateAction<boolean|null>>;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    bio: string;
    setBio: React.Dispatch<React.SetStateAction<string>>;
    profilePictureCdi: string;
    setProfilePictureCdi: React.Dispatch<React.SetStateAction<string>>;
    profilePictureUrl: string;
    setProfilePictureUrl: React.Dispatch<React.SetStateAction<string>>;
}

const initialState: UserDetails = {
    accountInitialized: false,
    setAccountInitialized: () => {},
    username: '',
    setUsername: () => {},
    bio: '',
    setBio: () => {},
    profilePictureCdi: `${process.env.REACT_APP_DEFAULT_AVATAR_CID}`,
    setProfilePictureCdi: () => {},
    profilePictureUrl: '',
    setProfilePictureUrl: () => {},
}

const UserDetailsContext = React.createContext<UserDetails>(initialState);

interface UserDetailsProviderProps {
    children: ReactNode,
}

export const UserDetailsProvider: React.FC<UserDetailsProviderProps> = ({ children }) => {
   const [accountInitialized, setAccountInitialized] = useState<boolean| null>(null);
   const [username, setUsername] = useState<string>();
   const [bio, setBio] = useState<string>('');
   const [profilePictureCdi, setProfilePictureCdi] = useState<string>(process.env.REACT_APP_DEFAULT_AVATAR_CID);
   const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');
   const {userProfileContract, signer} = useContracts();

    const checkUser = useCallback(async () => {
        try {
            const exists = await userProfileContract.existsUser();
            setAccountInitialized(exists);
        }catch (err){
            console.error("Can't verify user", err);
        }
    }, [userProfileContract, signer, setAccountInitialized]);

    useEffect(() => {
        console.log(username);
    }, [username]);

    useEffect(() => {
        console.log("signer", signer);
    }, [signer]);

    const fetchAndStoreUserDetails = useCallback(async () => {
            const profile = await userProfileContract.getProfile(signer);

            console.log(profile)
            setUsername(profile[0]);
            setBio(profile[1]);

            if(profile[2]){
                setProfilePictureCdi(profile[2]);
            }
            // const profilePictureUrl = await pinata.gateways.convert(profilePictureCdi);
        // TODO: remove hardcoding
            setProfilePictureUrl("https://gray-ready-gayal-243.mypinata.cloud/ipfs/bafkreielw242z5adle6zcqeml5k3vz3gwgsurvf3w7hnbgvtartlxauezy");
    }, [userProfileContract, signer, setUsername, setBio, setProfilePictureUrl, setProfilePictureCdi]);

    useEffect(() => {
        if (accountInitialized) {
            fetchAndStoreUserDetails()
                .catch((err) => console.log(err));
        }
    }, [fetchAndStoreUserDetails, accountInitialized]);

    useEffect(() => {
        if(userProfileContract){
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
        } as UserDetails}>
            {children}
        </UserDetailsContext.Provider>
    );
};

export const useUserDetails = () => useContext(UserDetailsContext);