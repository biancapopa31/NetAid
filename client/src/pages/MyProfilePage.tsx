import React, {useRef, useState} from "react";
import {useUserDetails} from "../contexts/UserDetailsContext";
import {SignOutButton, useUser} from "@clerk/clerk-react";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Link,
    Image,
    Skeleton,
    Input,
} from "@heroui/react";
import {useContracts} from "../contexts/ContractsContext";
import {Button} from "@heroui/button";
import { FaRegEdit } from "react-icons/fa";
import {pinata} from "../utils/config";
import {pinataService} from "../utils/pinataService";

export const MyProfilePage = () => {
    const {username, bio, profilePictureUrl, setBio, setUsername, setProfilePictureCdi, setProfilePictureUrl, profilePictureCdi} = useUserDetails();
    const {signer, userProfileContract} = useContracts();

    const [isEditing, setIsEditing] = useState(false);
    const [newUserName, setNewUserName] = useState(username);
    const [newBio, setNewBio] = useState("");
    const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
    const fileInputRef = useRef(null);

    const imageSize = 100;

    const handleSave = async () =>{
        let usernameTaken = false;

        console.log(newUserName, username);
        if(newUserName !== username){
            usernameTaken = await userProfileContract.existsUserByUserId(newUserName.trim());
        }

        if(!usernameTaken){
            if(newProfilePicture){
                const cid = await pinataService.uploadFile(newProfilePicture);

                const tx = await userProfileContract.editProfile(newUserName.trim(), newBio.trim(), cid);
                await tx.wait();

                setProfilePictureCdi(cid);
                const profilePictureUrl = await pinataService.convertCid(profilePictureCdi);
                setProfilePictureUrl(profilePictureUrl);
            }else{
                const tx = await userProfileContract.editProfile(newUserName.trim(), newBio.trim(), '');
                tx.wait();
            }
            setUsername(newUserName.trim());
            setBio(newBio.trim());
        }
        setIsEditing(!isEditing);
    }

    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input dialog
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen">
            <Card className="w-full max-w-[1024px] p-4 pb-0">
                <CardHeader className="flex gap-3">
                    <div className="relative">
                        {profilePictureUrl ? (
                            <Image
                                alt="profilePicture"
                                height={imageSize}
                                radius="sm"
                                src={newProfilePicture ? URL.createObjectURL(newProfilePicture): profilePictureUrl}
                                style={{
                                    aspectRatio: "1/1",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <Skeleton className="rounded-lg">
                                <div
                                    className="rounded-sm"
                                    style={{
                                        height: imageSize,
                                        width: imageSize,
                                    }}
                                ></div>
                            </Skeleton>
                        )}
                        {isEditing && (
                            <>
                            <FaRegEdit
                                className="absolute top-1 right-1 text-gray-700 p-0.5 z-10"
                                onClick={handleIconClick}
                                size={24}
                            />
                            <input
                                ref={fileInputRef}
                                id="profilePicture"
                                name="profilePicture"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    const file = event.target.files ? event.target.files[0] : null;
                                    setNewProfilePicture(file); // Update local state
                                }}
                                className={"hidden"}
                                />
                            </>

                        )}
                    </div>


                    <div className="flex flex-col gap-2">
                        {isEditing ? (
                            <Input
                                isRequired
                                className="text-md"
                                placeholder="Username"
                                defaultValue={username}
                                onChange={(e) => {
                                    console.log("Am schimbat valoarea",e.target.value);
                                    setNewUserName(e.target.value)
                                }}
                            />
                        ):
                            <p>{username}</p>
                            }

                        <p className="text-small text-default-500">Account: {signer?.address}</p>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody>
                    {isEditing ?
                            <Input
                                isReadOnly={!isEditing}
                                className="text-md"
                                placeholder="bio"
                                defaultValue={bio}
                                onChange={(e) => setNewBio(e.target.value)}
                            >
                            </Input>
                    :
                        <p>Bio: {bio}</p>
                    }

                </CardBody>
                <Divider/>
                <CardFooter className={"flex place-content-end gap-3"}>

                    {!isEditing ?<>
                        <Button color={"primary"} onPress={() => {setIsEditing(!isEditing)}}>
                            Edit profile
                        </Button>
                            <SignOutButton>
                                <Button color={"warning"}>
                                    Log Out
                                </Button>
                            </SignOutButton>
                        <Button color={"danger"}>
                            Delete profile
                        </Button></>
                        :<>
                            <Button color={"primary"} onPress={handleSave}>
                               Save changes
                            </Button>
                            <Button color={"danger"} onPress={() => {setIsEditing(!isEditing)}}>
                                Discard changes
                            </Button>
                        </>
                    }
                </CardFooter>
            </Card>
        </div>

    );
}