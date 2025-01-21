import React, {useEffect} from 'react';
import ethers from 'ethers';
import './App.css';
import {
    ClerkProvider,
    SignedIn,
    SignedOut,
} from "@clerk/clerk-react";
import {useNavigate} from "react-router";
import {SignInPage} from "./pages/SignInPage";
import {AppRoutes} from "./routes/AppRoutes";
import {UserDetailsProvider} from "./contexts/UserDetailsContext";
import {ContractsProvider} from "./contexts/ContractsContext";
import {LoaderPovider, useLoader} from "./contexts/LoaderContext";
import {Spinner} from "@heroui/react";

function App() {

    const {navigate} = useNavigate();
    return (
        <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY as string}
                       navigate={(to) => navigate(to)}>
            <SignedOut>
                <SignInPage/>
            </SignedOut>
            <SignedIn>
                <ContractsProvider>
                    <UserDetailsProvider>
                        <LoaderPovider>
                            <AppRoutes/>
                        </LoaderPovider>
                    </UserDetailsProvider>
                </ContractsProvider>
            </SignedIn>
        </ClerkProvider>
    );
}

export default App;

