import React, {useState} from "react";
import {useUserDetails} from "../contexts/UserDetailsContext";
import {SignOutButton, useUser} from "@clerk/clerk-react";
import {Card, CardBody, CardFooter, CardHeader, Divider, Link, Image, Skeleton} from "@heroui/react";
import {useContracts} from "../contexts/ContractsContext";
import {Button} from "@heroui/button";

export const MyProfilePage = () => {
    const {username, bio, profilePictureUrl, accountInitialized} = useUserDetails();
    const {signer} = useContracts();

    const [isEditing, setIsEditing] = useState(false);


    const imageSize = 100;

    return (
        <div className="flex flex-col items-center min-h-screen">
            <Card className="w-full max-w-[1024px] p-4 pb-0">
                <CardHeader className="flex gap-3">
                    {profilePictureUrl ? <Image
                            alt="profilePicture"
                            height={imageSize}
                            radius="sm"
                            src={profilePictureUrl}
                            style={{
                                aspectRatio: "1/1",
                                objectFit: "cover"
                            }}
                        />
                        : <Skeleton className={'rounded-lg'}>
                            <div className={'rounded-sm'} style={{
                                height: imageSize,
                                width: imageSize,
                            }}></div>
                        </Skeleton>
                    }

                    <div className="flex flex-col">
                        <p className="text-md">{username}</p>
                        <p className="text-small text-default-500">Account: {signer?.address}</p>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <p>Bio: {bio}</p>
                </CardBody>
                <Divider/>
                <CardFooter className={"flex place-content-end gap-3"}>
                   <Button color={"primary"}>
                       Edit profile
                   </Button>

                    <Button color={"warning"}>
                        <SignOutButton>
                        Log Out
                        </SignOutButton>
                    </Button>
                    <Button color={"danger"}>
                        Delete profile
                    </Button>
                </CardFooter>
            </Card>
        </div>

    );
}