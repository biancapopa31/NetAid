import {SignIn, SignInWithMetamaskButton} from "@clerk/clerk-react";

export const SignInPage = () => {
    return (
        <>
            <SignInWithMetamaskButton mode="modal">
             <button>Custom sign in button</button>
            </SignInWithMetamaskButton>
        </>
    );
}