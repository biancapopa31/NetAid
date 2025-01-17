import React, {ReactNode, useContext, useEffect, useState} from "react";
import {useUser} from "@clerk/clerk-react";

interface UserDetails {
    accountInitialized: boolean;
    setAccountInitialized: React.Dispatch<React.SetStateAction<boolean>>;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    bio: string;
    setBio: React.Dispatch<React.SetStateAction<string>>;
    profilePictureUri: string;
    setProfilePictureUri: React.Dispatch<React.SetStateAction<string>>;
}

const initialState: UserDetails = {
    accountInitialized: false,
    setAccountInitialized: () => {},
    username: '',
    setUsername: () => {},
    bio: '',
    setBio: () => {},
    profilePictureUri: '',
    setProfilePictureUri: () => {},
}

const UserDetailsContext = React.createContext<UserDetails>(initialState);

interface UserDetailsProviderProps {
    children: ReactNode,
}

export const UserDetailsProvider: React.FC<UserDetailsProviderProps> = ({ children }) => {
   const [accountInitialized, setAccountInitialized] = useState<boolean>(false);
   const [username, setUsername] = useState<string>();
   const [bio, setBio] = useState<string>('');
   const [profilePictureUri, setProfilePictureUri] = useState<string>('');

    const { user } = useUser();

    useEffect(() => {
        if (user) {
            const userAddress = user.primaryWeb3Wallet;
            fetchAndStoreUserDetails(userAddress)
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
        }
    }, [user]);

    const fetchAndStoreUserDetails = async (userAddress) => {

    };

    return (
        <UserDetailsContext.Provider value={{
            accountInitialized, setAccountInitialized,
            username, setUsername,
            bio, setBio,
            profilePictureUri, setProfilePictureUri,
            }}>
            {children}
        </UserDetailsContext.Provider>
    );
};

export const useUserDetails = () => useContext(UserDetailsContext);