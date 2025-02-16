import {Avatar, Card, CardBody, CardFooter, CardHeader, Divider, Image, useDisclosure} from "@heroui/react";
import React, {JSX, useEffect, useState} from "react";
import {Button} from "@heroui/button";
import {useContracts} from "../contexts";
import {AiFillLike, AiOutlineLike} from "react-icons/ai";
import {FaGasPump, FaRegCommentAlt, FaDonate} from "react-icons/fa";
import {useEstimatedGas, useEstimatedGasConditioned} from "../hooks";
import {useGasConvertor} from "../hooks/useGasConvertor";
import {toast} from "react-toastify";
import CommentBox from './CommentBox';
import {PostWithCreator} from "../interfaces/PostWithCreator";
import {DonationCard} from "./DonationCard";
import {convertTime} from "../utils/convertTime";

export const PostCard = ({post}: { post: PostWithCreator }): JSX.Element => {

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const {provider, postsContract, signer} = useContracts();
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");

    const {isOpen, onOpen, onClose} = useDisclosure();


    const likeGas = useEstimatedGas(postsContract, (c) => c.like, post.id);
    const unlikeGas = useEstimatedGasConditioned(postsContract, (c) => c.unlike, likeCount > 0, post.id as any);
    const likeETH = useGasConvertor(provider, likeGas?.gas);
    const unlikeETH = useGasConvertor(provider, unlikeGas?.gas);

    const currentUserIsCreator = post.creator === signer.address

    useEffect(() => {
        // TODO add this to postInterface and context
        postsContract.getLikeCount(post.id).then((response) => {
            setLikeCount(Number(response));
        }).catch((err) => {
            console.error("There was an error getting like count for post:", post.id, err);
        });

        postsContract.isLikedByUser(post.id, signer).then((response) => {
            setLiked(response);
        }).catch((err) => {
            console.error("There was an error getting like status for post:", post.id, err);

        })

    }, [post.id, postsContract, signer]);

    const handleLike = async () => {
        if (liked) {
            try {
                const tx = await toast.promise(postsContract.unlike(post.id), {
                    success: "Post unliked!",
                    error: "There was an error trying to unlike post!",
                    pending: "Processing unlike..."
                });
                await tx.wait();
                setLikeCount(likeCount - 1);
            } catch (err) {
                console.error("There was an error trying to unlike post:", err);
            }
        } else {
            try {
                const tx = await toast.promise(postsContract.like(post.id),
                    {
                        success: "Post Liked!",
                        error: "here was an error trying to like post!",
                        pending: "Processing like..."
                    });
                await tx.wait();
                setLikeCount(likeCount + 1);
            } catch (err) {
                console.error("There was an error trying to like post:", err);
            }

        }
        setLiked(!liked);
    }
    const handleComment = () => {
        setShowComments(!showComments);
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        try {
            const tx = await postsContract.addComment(post.id, commentText.trim());
            await tx.wait();
            toast.success('Comment added successfully!');
            setCommentText("");
        } catch (err) {
            console.error("There was an error trying to add comment:", err);
            toast.error('There was an error trying to add comment!');
        }
    };

    return (
            <Card className="w-full max-w-[1024px] pb-0">
                <CardHeader className="justify-between px-7 pt-7">
                    <div className="flex gap-5">
                        <Avatar
                            isBordered
                            radius={"full"}
                            size="md"
                            color="primary"
                            src={post.profilePictureUrl}
                        />
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <h4 className="text-small font-semibold leading-none text-default-600">@{post?.username}</h4>
                        </div>
                    </div>
                    <p className={"text-small text-default-400"}> {convertTime(post.timestamp)} </p>
                </CardHeader>
                <Divider/>
                <CardBody className="px-7 text-small text-default-700 min-h-1 gap-3 py-3">
                    <p>{post.text}</p>
                    <div className="flex justify-center w-full">
                        {post.photoUrl &&
                            <Image
                                alt={"Post Image"}
                                className={"max-h-[20rem]"}
                                radius={"sm"}
                                src={post.photoUrl}
                            ></Image>}
                    </div>
                </CardBody>
                <Divider></Divider>
                <CardFooter className="flex flex-col gap-3 px-7">
                    <div className="flex justify-between w-full">
                        <div className={"flex gap-3 justify-start"}>
                            <div className={"flex flex-col items-center"}>
                                <Button variant={"light"} onPress={handleLike} color={"primary"}>
                                    {likeCount}
                                    {liked ? <AiFillLike size={20} color={'hsl(var(--heroui-primary))'}
                                                         style={{color: "primary"}}/> : <AiOutlineLike size={20}/>}
                                    Like
                                </Button>
                                <p className={"flex flex-row text-default-400 text-small gap-1 items-center"}>
                                    <FaGasPump/>
                                    {liked ? unlikeETH?.eth : likeETH?.eth}
                                </p>
                            </div>
                            <Button variant={"light"} color={"primary"} onPress={handleComment}>
                                <FaRegCommentAlt/>
                                Comment
                            </Button>
                        </div>

                        <Button variant={"light"} color={"primary"} onPress={onOpen} isDisabled={currentUserIsCreator}>
                            <FaDonate/>
                            Make Donation
                        </Button>
                        <DonationCard isOpen={isOpen} onClose={onClose} post={post}/>
                    </div>

                    {showComments && (
                        <div className="w-full radi ">
                            <CommentBox postId={String(post.id)}/>
                            {/*TODO: change type of postId to number in commentBox*/}
                        </div>
                    )}

                </CardFooter>
            </Card>
    );
}