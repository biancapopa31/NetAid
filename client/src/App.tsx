import React from 'react';
import './App.css';
import {
    ClerkProvider,
    SignedIn,
    SignedOut,
} from "@clerk/clerk-react";
import { DecisionPage, feedLoader, FeedPage, HomePage, MyProfilePage, NewAccountPage, SignInPage } from "./pages";
import {
    UserDetailsProvider, PostsProvider, EventProvider, ContractsProvider, LoaderPovider,
    ContractsSpinner
} from "./contexts";
import { createBrowserRouter, createRoutesFromElements, Route, RouteProps, RouterProvider } from "react-router-dom";
import { RootLayout } from "./layout/RootLayout";
import { Bounce, ToastContainer } from 'react-toastify';
import ErrorBoundary from './components/ErrorBoundary';


const router = createBrowserRouter(
    createRoutesFromElements([
        <Route index path={'/'} element={<DecisionPage />}></Route>,
        <Route path={'/home'} element={<ContractsSpinner><RootLayout /></ContractsSpinner>}>
            <Route index path={''} element={<FeedPage />}></Route>
            <Route path={'myProfile'} element={<MyProfilePage />}></Route>
        </Route>,
        <Route path="/newAccount" element={<ContractsSpinner><NewAccountPage /></ContractsSpinner>} />
    ])
);

function App() {
    return (
        <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY as string} afterSignOutUrl={'/'}>
            <ErrorBoundary fallback={<p>Failed to load wallet.</p>}>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <SignedOut>
                <SignInPage />
            </SignedOut>
            <SignedIn>
                <ContractsProvider>
                    <UserDetailsProvider>
                        <LoaderPovider>
                            <EventProvider>
                                <PostsProvider>
                                    <RouterProvider router={router}></RouterProvider>
                                </PostsProvider>
                            </EventProvider>
                        </LoaderPovider>
                    </UserDetailsProvider>
                </ContractsProvider>
            </SignedIn>
            </ErrorBoundary>
        </ClerkProvider>
    );
}

export default App;

