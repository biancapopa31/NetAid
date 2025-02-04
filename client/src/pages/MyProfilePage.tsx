import React, {useEffect, useRef, useState} from "react";
import {useUserDetails} from "../contexts/UserDetailsContext";
import {SignOutButton, useUser} from "@clerk/clerk-react";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Image,
    Skeleton,
    Input, Checkbox,
} from "@heroui/react";
import {useContracts} from "../contexts/ContractsContext";
import {Button} from "@heroui/button";
import {FaGasPump, FaRegEdit} from "react-icons/fa";
import {pinataService} from "../utils/pinataService";
import {useEstimatedGasConditioned} from "../hooks";
import {MdDeleteOutline} from "react-icons/md";
import {CiCircleRemove} from "react-icons/ci";
import {IoIosRemoveCircleOutline} from "react-icons/io";
import {useGasConvertor} from "../hooks/useGasConvertor";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {useEvents} from "../contexts/EventsContext";

export const MyProfilePage = () => {
    const minGasLimit = 21000
    const imageSize = 150;

    const {
        username,
        bio,
        profilePictureUrl,
        setBio,
        setUsername,
        setProfilePictureCdi,
        setProfilePictureUrl,
        profilePictureCdi
    } = useUserDetails();
    const {signer, userProfileContract, provider} = useContracts();
    const {profileUpdated$} = useEvents();

    const [isEditing, setIsEditing] = useState(false);
    const [newUserName, setNewUserName] = useState(username);
    const [newBio, setNewBio] = useState(bio);
    const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
    const [gasLimit, setGasLimit] = useState<number>(minGasLimit);
    const fileInputRef = useRef(null);
    const [calculateGas, setCalculateGas] = useState<boolean>(false);
    const gasCost = useEstimatedGasConditioned(userProfileContract, (c) => c.editProfile, calculateGas, newUserName.trim(), newBio.trim(), newProfilePicture ? process.env.REACT_APP_DEFAULT_AVATAR_CID : '')
    const ethCost = useGasConvertor(provider, gasCost?.gas);
    const gasLimitEth = useGasConvertor(provider, BigInt(gasLimit));
    const [approveGasLimit, setApproveGasLimit] = useState<boolean>(false);

    useEffect(() => {
        if (bio !== newBio) {
            setCalculateGas(true);
            return;
        }
        if (username !== newUserName) {
            setCalculateGas(true);
            return;
        }
        if (newProfilePicture != null) {
            setCalculateGas(true);
            return;
        }
        setCalculateGas(false);

    }, [bio, username, newProfilePicture, newBio, newUserName]);


    const handleSave = async () => {
        let usernameTaken = false;

        let transactionOptions = {};
        if(approveGasLimit){
            transactionOptions = {gasLimit: gasLimit};
        }


        if (newUserName !== username) {
            usernameTaken = await userProfileContract.existsUserByUserId(newUserName.trim());
        }

        if (!usernameTaken) {
            try {
                if (newProfilePicture) {
                    const cid = await pinataService.uploadFile(newProfilePicture);

                    const tx = await userProfileContract.editProfile(newUserName.trim(), newBio.trim(), cid, transactionOptions);
                    await tx.wait();

                    setProfilePictureCdi(cid);
                    const profilePictureUrl = await pinataService.convertCid(profilePictureCdi);
                    setProfilePictureUrl(profilePictureUrl);
                } else {
                    const tx = await userProfileContract.editProfile(newUserName.trim(), newBio.trim(), '', transactionOptions);
                    tx.wait();
                }
            }catch (error) {
                console.error("There was an error updating the account!",error);
                toast.error('There was an error updating the account!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
            setUsername(newUserName.trim());
            setBio(newBio.trim());
        }
        setCalculateGas(false);
        setApproveGasLimit(false);
        setGasLimit(minGasLimit);
        setIsEditing(!isEditing);
    }

    const handleEditIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input dialog
        }
    };

    const handleDeleteIconClick = () => {
        setNewProfilePicture(null);
    }

    const handleDiscard = () => {
        setIsEditing(!isEditing)
        setNewUserName(username);
        setNewBio(bio);
        setNewProfilePicture(null);
        setApproveGasLimit(false);
        setGasLimit(minGasLimit)
        setCalculateGas(false);
    }

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
                                src={newProfilePicture ? URL.createObjectURL(newProfilePicture) : profilePictureUrl}
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
                                    onClick={handleEditIconClick}
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
                                <IoIosRemoveCircleOutline
                                    className="absolute top-1 left-1 text-gray-700 p-0.5 z-10"
                                    onClick={handleDeleteIconClick}
                                    size={27}
                                />
                            </>

                        )}
                    </div>


                    <div className="flex flex-col gap-2">
                        <p className={"text-small"}>Username:</p>
                        {isEditing ? (
                                <Input
                                    isRequired
                                    className="text-md"
                                    placeholder="Username"
                                    defaultValue={username}
                                    onChange={(e) => {
                                        setNewUserName(e.target.value)
                                    }}
                                />
                            ) :
                            <p>{username}</p>
                        }

                        <p className="text-small text-default-500">Account: {signer?.address}</p>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody className={"gap-2"}>
                    <p className={"text-small"}>Bio: </p>
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
                        <p>{bio}</p>
                    }

                </CardBody>
                <Divider/>
                <CardFooter className={"flex place-content-end gap-3 items-start"}>

                    {!isEditing ?
                        <>
                            <Button color={"primary"} onPress={() => {
                                setIsEditing(!isEditing)
                            }}>
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
                        : <div className={"flex flex-row justify-between w-full gap-3"}>
                            <div className={"flex flex-row gap-3 pt-0x"}>
                                <Checkbox
                                          color="primary"
                                          size='sm'
                                          onChange={() => {
                                              setApproveGasLimit(!approveGasLimit)
                                          }}
                                          isSelected={approveGasLimit}
                                >
                                </Checkbox>
                                <Input
                                    description={"Do you want to place a gas limit on this transaction? (In gas units)"}
                                    placeholder={"Gas limit (In gas units)"}
                                    onValueChange={(value) => setGasLimit(value)}
                                    value={gasLimit.toString()}
                                    min={21000}
                                    type="number"
                                    isDisabled={!approveGasLimit}
                                    className={"w-fit gap-3"}
                                ></Input>
                                <p className={!approveGasLimit ? "text-small pt-3 text-default-400" : "text-small pt-3"}>Gas limit in ETH: {gasLimitEth?.eth}</p>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <div className={"flex flex-row gap-3 align-middle justify-center items-center"}>
                                    <Button color={"primary"} onPress={handleSave}>
                                        Save changes
                                    </Button>

                                    <Button color={"danger"} onPress={handleDiscard}>
                                        Discard changes
                                    </Button>
                                </div>

                                <p className={"flex flex-row text-default-400 text-small gap-1.5 items-center"}>
                                    <FaGasPump/>
                                    {ethCost?.eth ? ethCost?.eth : 0} ETH
                                </p>
                            </div>

                        </div>
                    }
                </CardFooter>
            </Card>
        </div>

    );
}