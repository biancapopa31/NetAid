import { SignInWithMetamaskButton } from "@clerk/clerk-react";
import { Button } from "@heroui/button";
import {Card, CardBody, CardHeader,Textarea} from "@heroui/react";

export const SignInPage = () => {
    return (
        <div
            className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600"
        >
            <Card className="w-96 shadow-lg">
                <CardHeader>
                        Welcome to NetAid!
                </CardHeader>
                <CardBody>
                    <SignInWithMetamaskButton mode="modal">
                        <Button
                            color="primary"
                            size="lg"
                        >
                            Sign in with MetaMask
                        </Button>
                    </SignInWithMetamaskButton>

                </CardBody>
            </Card>
        </div>
    );
};
