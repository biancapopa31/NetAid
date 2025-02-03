import { Alert, Avatar, Card, CardBody, CardFooter, CardHeader, Divider, Image, Textarea } from "@heroui/react";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { useFocusHandler } from "../hooks";
import { useUserDetails } from "../contexts/UserDetailsContext";
import { FaCamera } from "react-icons/fa";
import { useContracts } from "../contexts/ContractsContext";
import { pinataService } from "../utils/pinataService";
import decodeInterface from "../interfaces/decode-interface";
import { Post, postKeys } from "../interfaces/Post";

const NewPostCard = ({ onNewPost }) => {
    const [isFocused, setIsFocused] = useState(false);
    const cardRef = useRef(null);
    const fileInputRef = useRef(null);
    useFocusHandler(cardRef, setIsFocused);

    const { postsContract } = useContracts();
    const { profilePictureUrl, username } = useUserDetails();
    const [inputFile, setInputFile] = useState<File | null>(null);
    const [postText, setPostText] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input dialog
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        setUploading(true);
        let upload = '';
        if (inputFile) {
            upload = await pinataService.uploadFile(inputFile);
        }
        const tx = await postsContract.createPost(postText.trim(), upload);
        const receipt = await tx.wait();
        const newPostEvent = receipt.events.find(event => event.event === 'PostCreated');
        const newPost = decodeInterface<Post>(postKeys, newPostEvent.args[0]);
        onNewPost(newPost);
        setUploading(false);
        setIsFocused(false);
        setPostText('');
        setInputFile(null);
    };

    useEffect(() => {
        setInputFile(null);
        setPostText("");
    }, [isFocused]);

    return (
        <Card
            ref={cardRef}
            className="w-full w-[1024px] p-4 pb-0"
        >
            <CardHeader className="justify-between">
                <div className="flex gap-5">
                    <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        color={"primary"}
                        src={profilePictureUrl}
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">@{username}</h4>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400 max-h-2xl">
                <Textarea
                    className={isFocused ? "" : " animate-[height-in_2s_infinite]"}
                    placeholder="What are you thinking about?"
                    minRows={isFocused ? 3 : 1}
                    value={postText}
                    onValueChange={(value) => { setPostText(value) }}
                >
                </Textarea>
                {inputFile && isFocused && (
                    <Image
                        alt="post photos"
                        src={URL.createObjectURL(inputFile)}
                        className={"items-center max-w-[100%] max-h-[20rem]"}
                    />
                )}
            </CardBody>
            <CardFooter className="gap-3 justify-between px-5">
                {isFocused && (
                    <>
                        <input
                            ref={fileInputRef}
                            id="profilePicture"
                            name="profilePicture"
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                const file = event.target.files ? event.target.files[0] : null;
                                setInputFile(file); // Update local state
                            }}
                            className={"hidden"}
                        />
                        <FaCamera color={"hsl(var(--heroui-primary))"} onClick={handleIconClick} size={19} />
                        <Button color={"primary"} variant={"ghost"} size={'sm'} onPress={handlePost} isLoading={uploading}>
                            Post
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
};

export default NewPostCard;