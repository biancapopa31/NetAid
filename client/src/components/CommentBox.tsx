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
    const { signer } = useContracts(); // Use signer instead of provider
    const {commentsContract} = useContracts();

    /*
    * Chestia asta e ca sa asculti enetul de commentCreated
    * */
    useEffect(() => {
        if (!commentCreated$) return;
        const sub = commentCreated$.subscribe((value) => {
            toast.success('Comment posted successfully!');
        });
        return () => sub.unsubscribe();
    }, [commentCreated$]);

    useEffect(() => {
        fetchComments();
    }, [commentsContract, postId]);

    const fetchComments = async () => {
        if (commentsContract) {
            try {
                const data = await commentsContract.getCommentsForPost(parseInt(postId));
                const decodedComments = data.map((commentData: any) =>
                    decodeInterface<Comment>(commentKeys, commentData)
                );
                setComments(decodedComments);
            } catch (err) {
                console.error("There was an error fetching comments:", err);
                toast.error('There was an error fetching comments!');
            }
        }
    };
    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(e.target.value);
    };

    const saveReceiptToFile = (receipt: any) => {
        const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transaction_receipt.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    /*
    * De o parte din ce e aici nu cred ca o sa mai ai nevoide
    * doar sa adaugi comentariul in setComments
    * Nu m-am uitat foarte bine dar cred ca asa e
    * */
    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newComment.trim() && commentsContract) {
            try {
                const tx = await commentsContract.createComment(newComment.trim(), parseInt(postId));
                const receipt = await tx.wait();
                
                // Save receipt to a file
                // saveReceiptToFile(receipt);
                
                const events = receipt.events || [];
                console.log("Transaction events:", events); // Log events for debugging
                
                const newCommentEvent = events.find(event => event.event === 'CommentCreated');
                if (newCommentEvent) {
                    const decodedEvent = commentsContract.interface.decodeEventLog(
                        'CommentCreated',
                        newCommentEvent.data,
                        newCommentEvent.topics
                    );
                    const newCommentObj: Comment = {
                        id: decodedEvent.id.toNumber(),
                        text: decodedEvent.text,
                        timestamp: decodedEvent.timestamp.toNumber(),
                        creator: decodedEvent.creator
                    };
                    setComments(prevComments => [newCommentObj, ...prevComments].sort((a, b) => b.timestamp - a.timestamp));
                    setNewComment('');
                } else {
                    toast.error('Comment creation failed. Please try again!');
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
                            {commentKeys.map(key => (
                                <div key={key}>
                                    <strong>{key}:</strong> {comment[key as keyof Comment]}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    );
};

export default CommentBox;