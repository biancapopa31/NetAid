import React, { useState, useEffect } from 'react';
import { useUserDetails } from "../contexts/UserDetailsContext";
import { useContracts } from "../contexts/ContractsContext";
import { Card, CardBody, CardFooter, CardHeader, Divider, Textarea } from "@heroui/react";
import { Button } from "@heroui/button";
import { toast, Bounce, ToastContainer } from "react-toastify";
import { Comment, commentKeys } from "../interfaces/Comment";
import commentAbi from "../abi/Comment.json";
import { ethers } from "ethers";
import decodeInterface from "../interfaces/decode-interface";
import {useEvents} from "../contexts";

const CommentBox = ({ postId }: { postId: string }): React.JSX.Element => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const { username } = useUserDetails();
    const {commentCreated$} = useEvents();
    const { signer } = useContracts();
    const {commentsContract, userProfileContract} = useContracts();

    useEffect(() => {
        fetchComments();
    }, [commentsContract, postId]);

    const getUsernameFromPublicId = async (publicId: string): Promise<string> => {
        try {
            const profile = await userProfileContract.getProfile(publicId);
            return profile.username;
        } catch (err) {
            console.error("There was an error fetching the username:", err);
            return publicId; // Fallback to publicId if username fetch fails
        }
    };

    const fetchComments = async () => {
        if (commentsContract) {
            try {
                const data = await commentsContract.getCommentsForPost(parseInt(postId));
                const decodedComments = data.map((commentData: any) =>
                    decodeInterface<Comment>(commentKeys, commentData)
                );
                const commentsWithUsernames = await Promise.all(decodedComments.map(async (comment) => {
                    const username = await getUsernameFromPublicId(comment.creator);
                    return { ...comment, creator: username };
                }));
                setComments(commentsWithUsernames);
            } catch (err) {
                console.error("There was an error fetching comments:", err);
                toast.error('There was an error fetching comments!');
            }
        }
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newComment.trim() && commentsContract) {
            try {
                const tx = await commentsContract.createComment(newComment.trim(), parseInt(postId));
                const receipt = await tx.wait();
                
                if (!receipt.status) {
                    throw new Error('Transaction failed');
                }
                console.error("Transaction receipt:", receipt); // Log receipt for debugging
                const events = receipt.events || [];
                console.log("Transaction events:", events); // Log events for debugging
                
                const newCommentEvent = events.find((event: any) => event.topics[0] === commentAbi.topics[0]);
                if (newCommentEvent) {
                    const decodedEvent = commentsContract.interface.decodeEventLog(
                        'CommentCreated',
                        newCommentEvent.data,
                        newCommentEvent.topics
                    );
                    const username = await getUsernameFromPublicId(decodedEvent.creator);
                    const newCommentObj: Comment = {
                        id: decodedEvent.id.toNumber(),
                        text: decodedEvent.text,
                        timestamp: decodedEvent.timestamp.toNumber(),
                        creator: username
                    };
                    setComments(prevComments => [newCommentObj, ...prevComments].sort((a, b) => b.timestamp - a.timestamp));
                    setNewComment('');
                } else {
                    console.error('Comment creation failed. Please try again!');
                    fetchComments();
                    toast.success('Comment posted successfully!');
                }
            } catch (err) {
                console.error("There was an error trying to submit the comment:", err);
                toast.error('There was an error trying to submit the comment!');
            }
        }
    };

    return (
        <Card className="w-full max-w-[1024px] pb-0">
            <CardHeader className="justify-between px-7 pt-7">
                <div className="flex gap-5 w-full">
                    <div className="flex flex-col gap-1 items-start justify-center w-full">
                        <h4 className="text-small font-semibold leading-none text-default-600">@{username}</h4>
                    </div>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="px-7 text-small text-default-700 min-h-1 gap-3 py-3 w-full">
                <form onSubmit={handleCommentSubmit} className="w-full flex gap-2">
                    <Textarea
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Write a comment..."
                        className="flex-grow"
                    />
                    <Button type="submit" className="flex-shrink-0">Post Comment</Button>
                </form>
            </CardBody>
            <Divider />
            <CardFooter className="gap-3 px-7 w-full">
                <div className="comments-list w-full">
                    {comments.map((comment, index) => (
                        <div key={index} className="comment w-full">
                            <strong>@{comment.creator}:</strong> {comment.text}
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    );
};

export default CommentBox;