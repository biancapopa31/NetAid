import React, {ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {useUser} from "@clerk/clerk-react";
import {useContracts} from "./ContractsContext";
import {ethers} from "ethers";
import {pinata} from "../utils/config";
import {useLoader} from "./LoaderContext";
import decodeInterface from "../interfaces/decode-interface";
import {UserProfile, userProfileKeys} from "../interfaces/UserProfile";
import {pinataService} from "../utils/pinataService";

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
    accountInitialized: null,
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


    const fetchAndStoreUserDetails = useCallback(async () => {
            const response = await userProfileContract.getProfile(signer);
            const profile = decodeInterface<UserProfile>(userProfileKeys, response);

            setUsername(profile.username);
            setBio(profile.bio);
            if(profile.profilePictureCid){
                setProfilePictureCdi(profile.profilePictureCid);
                const profilePictureUrl = await pinataService.convertCid(profile.profilePictureCid);
                setProfilePictureUrl(profilePictureUrl);
            }else {
                // TODO: remove hardcoding
                setProfilePictureUrl(process.env.REACT_APP_DEFAULT_PROFILE_PICTURE);
            }

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