import { SignUp, useSignIn, useSignUp } from "@clerk/clerk-react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, Image } from "@heroui/react";
import metamaskIcon from "../assets/metamaskIcon.png";
import { toast } from "react-toastify";

export const SignInPage = () => {
    const { signIn } = useSignIn();
    const { signUp } = useSignUp();

    const handleMetamaskSignIn = async () => {
        try {
            const result = await signIn?.authenticateWithMetamask();
            if (result?.status === "complete") {
                toast.success("Successfully signed in with MetaMask!");
                window.location.assign("/");
            } else {
                toast.error("MetaMask sign-in was not completed.");
            }
        } catch (signInErr: any) {
            // Check if the error is because the account doesn't exist
            const isUnknownAccount = signInErr.errors?.[0]?.code === "form_identifier_not_found";

            if (!isUnknownAccount) {
                // Some other sign-in error — show it and stop
                toast.error(
                    signInErr.errors?.[0]?.longMessage
                    ?? signInErr.errors?.[0]?.message
                    ?? signInErr.message
                    ?? "Failed to sign in with MetaMask"
                );
                return;
            }

            // Account doesn't exist — try sign up
            try {
                const result = await signUp?.authenticateWithMetamask();
                if (result?.status === "complete") {
                    toast.success("Account created! Welcome to NetAid!");
                    window.location.assign("/");
                } else {
                    toast.error("MetaMask sign-up was not completed.");
                }
            } catch (signUpErr: any) {
                toast.error(
                    signUpErr.errors?.[0]?.longMessage
                    ?? signUpErr.errors?.[0]?.message
                    ?? signUpErr.message
                    ?? "Failed to create account with MetaMask"
                );
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
            <Card className="w-96 shadow-lg p-4">
                <CardHeader className="flex justify-center">
                    Welcome to NetAid!
                </CardHeader>
                <CardBody className="flex flex-col h-full items-center">
                    <Image
                        width={150}
                        src={metamaskIcon}
                        height="100%"
                    />
                    <Button
                        color="primary"
                        size="lg"
                        className="px-8"
                        onPress={handleMetamaskSignIn}
                    >
                        Sign in with MetaMask
                    </Button>
                    <div id="clerk-captcha" />
                </CardBody>
            </Card>
        </div>
    );
};