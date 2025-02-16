import React, {useContext, useEffect} from "react";
import {useContracts} from "./ContractsContext";
import {useUserDetails} from "./UserDetailsContext";

interface Loader {
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialState: Loader = {
    isLoading: true,
    setIsLoading: () => {
    },
}

const LoaderContext = React.createContext<Loader>(initialState);

interface LoaderProviderProps {
    children: React.ReactNode;
}

export const LoaderPovider: React.FC<LoaderProviderProps> = ({children}) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const {username, profilePictureUrl, accountInitialized} = useUserDetails();

    useEffect(() => {
        if((username && profilePictureUrl) || accountInitialized === false){
            setIsLoading(false);
            console.log("Loading is done!", accountInitialized);
        }
    }, [username, profilePictureUrl, accountInitialized]);

    return (
        <LoaderContext.Provider value={{
            isLoading, setIsLoading
        }}>
            {children}
        </LoaderContext.Provider>
    )
}

export const useLoader = () => useContext(LoaderContext);