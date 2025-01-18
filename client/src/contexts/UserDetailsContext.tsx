import React, {ReactNode, useContext, useEffect, useState} from "react";
import {useUser} from "@clerk/clerk-react";
import {useContracts} from "./ContractsContext";

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
   const {userProfileContract} = useContracts();

    const { user } = useUser();

    useEffect(() => {
        if (user && accountInitialized) {
            const userAddress = user.primaryWeb3Wallet;
            console.log("Inainte de fetchAndStoreUserDetails");
            fetchAndStoreUserDetails(userAddress)
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
        }
    }, [user, accountInitialized]);

    useEffect(() => {
        if(userProfileContract){
            checkUser();
        }
    }, [userProfileContract]);

    const checkUser = async () => {
        const exists = await userProfileContract.existsUser();
        setAccountInitialized(exists);
    }

//TODO see why i can't use user address as parameter
// TODO: finish fetch user data
    const fetchAndStoreUserDetails = async (userAddress) => {
        const profile = userProfileContract.getProfile(userAddress);
    };

    return (
        <UserDetailsContext.Provider value={{
            accountInitialized, setAccountInitialized,
            username, setUsername,
            bio, setBio,
            profilePictureUri, setProfilePictureUri,
        } as UserDetails}>
            {children}
        </UserDetailsContext.Provider>
    );
};

export const useUserDetails = () => useContext(UserDetailsContext);