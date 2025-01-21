import * as Yup from 'yup';
// import {ErrorMessage, Field, Form, Formik} from "formik";
import React, {useRef, useState} from "react";
import {pinata} from "../utils/config";
import {useContracts} from "../contexts/ContractsContext";
import {useNavigate} from "react-router";
import {useUserDetails} from "../contexts/UserDetailsContext";
import {Card, CardBody, CardHeader, Input, Form, Textarea, Image, Divider} from "@heroui/react";
import {Button} from "@heroui/button";
import {FaPlus} from "react-icons/fa";
import {SignOutButton} from "@clerk/clerk-react";


export function NewAccountPage() {
    const {userProfileContract, signer} = useContracts();
    const {
        setUsername,
        setBio,
        setAccountInitialized,
        setProfilePictureCdi,
        setProfilePictureUrl,
    } = useUserDetails();

    const [newUsername, setNewUsername] = useState("");
    const [newBio, setNewBio] = useState("");
    const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const imageSize = 200;


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        const values = Object.fromEntries(new FormData(e.currentTarget));

        console.log(values.username, typeof(values.username));
        const taken = await userProfileContract.existsUserByUserId(values.username);

        if (taken) {
            setLoading(false);
            setErrors({username:"This username is already taken."});
            return;
        }

        //TODO see how can we handle errors from blockchain
        if (newProfilePicture) {
            try {
                const upload = await pinata.upload.file(newProfilePicture);

                const tx = await userProfileContract.createNewProfile(values.username, values.bio, upload.IpfsHash);
                await tx.wait();

                setProfilePictureCdi(upload.IpfsHash);

                const profilePictureUrl = await pinata.gateways.convert(upload.IpfsHash);
                setProfilePictureUrl(profilePictureUrl);
            } catch (err) {
                console.error("There was an error creating the account", err);
                setLoading(false);
                return;
            }
        } else {
            try {
                const tx = await userProfileContract.createNewProfile(values.username, values.bio, '');
                await tx.wait();

            } catch (err) {
                console.error("There was an error creating the account", err);
                setLoading(false);
                return;
            }
        }
        console.log(values);
        setUsername(values.username as string);
        setBio(values.bio as string);
        setAccountInitialized(true);
        navigate("/home");

    }

    const handleClear = () => {
        setNewProfilePicture(null);
        setNewUsername("");
        setNewBio("");
    }

    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input dialog
        }
    };

    return (
        <div className={"flex flex-col items-center m-5"}>
            <Card className={"w-full max-w-[1024px] p-4 pb-0 text-xl"}>
                <CardHeader className={"justify-center pb-5"}>Create your account</CardHeader>
                <Divider/>
                <CardBody>
                    <Form validationBehavior="native" onSubmit={handleSubmit}
                          validationErrors={errors}
                          className={"gap-4"}
                    >
                        <div className="flex flex-row gap-2">
                            <p className={"text-small"}>Account: </p>
                            <p className="text-small text-default-500"> {signer?.address}</p>

                        </div>
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
                        <>
                            <label
                                className={"text-small font-normal pb-0 mb-0"}
                            >Profile picture</label>

                            {newProfilePicture ?
                                <div className={"flex flex-row justify-center gap-3 items-end"}>
                                    <Image
                                        alt="profilePicture"
                                        height={imageSize}
                                        radius="sm"
                                        src={URL.createObjectURL(newProfilePicture)}
                                        style={{
                                            aspectRatio: "1/1",
                                            objectFit: "cover",
                                        }}

                                    />
                                    <Button onPress={handleIconClick} color={"primary"}
                                            variant={"ghost"}>Change</Button>
                                    <Button onPress={() => {
                                        setNewProfilePicture(null)
                                    }} color={"warning"} variant={"ghost"}>Remove</Button>
                                </div>
                                :
                                <div
                                    onClick={handleIconClick}
                                    className="rounded-lg bg-default flex justify-center items-center"
                                    style={{
                                        height: imageSize,
                                        width: imageSize,
                                        backgroundColor: "default"
                                    }}
                                >
                                    <FaPlus className="h-7 w-7" size={20} color={"gray"}/>
                                </div>
                            }
                        </>

                        <Input
                            isRequired={true}
                            label={"Username"}
                            labelPlacement="outside"
                            name="username"
                            placeholder="Enter your username"
                            value={newUsername}
                            onValueChange={(value) => {setNewUsername(value.trim())}}
                        ></Input>

                        <Textarea
                            label={"Bio"}
                            labelPlacement="outside"
                            name="bio"
                            placeholder="Tell us about yourself"
                            value={newBio}
                            onValueChange={(value) => {setNewBio(value.trim())}}
                        ></Textarea>
                        <Divider/>

                        <div className={"flex flex-row gap-3"}>
                            <Button color="primary" type="submit" isLoading={loading}>
                                Create Account
                            </Button>
                            <Button color={"danger"} variant={"ghost"} onPress={handleClear}>
                                Clear
                            </Button>
                            <SignOutButton>
                                <Button color={"danger"}>
                                        Discard
                                </Button>
                            </SignOutButton>

                        </div>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}