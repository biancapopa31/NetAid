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
import {
    UserDetailsProvider, PostsProvider, EventProvider, ContractsProvider, LoaderPovider
} from "./contexts";

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
                                <PostsProvider>
                                    <AppRoutes/>
                                </PostsProvider>
                            </EventProvider>
                        </LoaderPovider>
                    </UserDetailsProvider>
                </ContractsProvider>
            </SignedIn>
        </ClerkProvider>
    );
}

export default App;

