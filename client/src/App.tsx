import React from 'react';
import './App.css';
import {
    ClerkProvider,
    SignedIn,
    SignedOut,
} from "@clerk/clerk-react";
import {useNavigate} from "react-router";
import {SignInPage} from "./pages";
import {AppRoutes} from "./routes/AppRoutes";
import {UserDetailsProvider} from "./contexts/UserDetailsContext";
import {ContractsProvider} from "./contexts/ContractsContext";
import {LoaderPovider} from "./contexts/LoaderContext";
import {EventProvider} from "./contexts/EventsContext";

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
                            <EventProvider>
                                <AppRoutes/>
                            </EventProvider>
                        </LoaderPovider>
                    </UserDetailsProvider>
                </ContractsProvider>
            </SignedIn>
        </ClerkProvider>
    );
}

export default App;

