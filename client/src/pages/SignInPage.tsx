import { SignInWithMetamaskButton } from "@clerk/clerk-react";
import { Button } from "@heroui/button";
import {Card, CardBody, CardHeader, Image, Textarea} from "@heroui/react";
import metamaskIcon from "../assets/metamaskIcon.png";

export const SignInPage = () => {
    return (
        <div
            className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600"
        >
            <Card className="w-96 shadow-lg p-4">
                <CardHeader className={"flex justify-center"}>
                        Welcome to NetAid!
                </CardHeader>
                <CardBody className={"flex flex-col h-full items-center"}>
                    <Image
                        width={150}
                        src={metamaskIcon}
                        height="100%"
                        className=""
                    >

                    </Image>
                    <SignInWithMetamaskButton mode="modal">
                        <Button
                            color="primary"
                            size="lg"
                            className={"px-8"}
                        >
                            Sign in with MetaMask
                        </Button>
                    </SignInWithMetamaskButton>

                </CardBody>
            </Card>
        </div>
    );
};
