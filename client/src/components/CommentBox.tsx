import React, { useState, useEffect } from 'react';
import { useUserDetails } from "../contexts/UserDetailsContext";
import { useContracts } from "../contexts/ContractsContext";
import { Card, CardBody, CardFooter, CardHeader, Divider, Textarea } from "@heroui/react";
import { Button } from "@heroui/button";
import { toast, Bounce } from "react-toastify";
import { Comment, commentKeys } from "../interfaces/Comment";
import commentAbi from "../abi/Comment.json";
import { ethers } from "ethers";

const CommentBox = ({ postId }: { postId: string }): React.JSX.Element => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const { username } = useUserDetails();
    const { signer } = useContracts();
    const [commentsContract, setCommentsContract] = useState<ethers.Contract | null>(null);

    useEffect(() => {
        if (signer) {
            const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // Replace with your contract address
            const contract = new ethers.Contract(contractAddress, commentAbi, signer);
            setCommentsContract(contract);
        }
    }, [signer]);

    useEffect(() => {
        const fetchComments = async () => {
            if (commentsContract) {
                try {
                    const fetchedComments = await commentsContract.getCommentsForPost(parseInt(postId));
                    setComments(fetchedComments.sort((a, b) => b.timestamp - a.timestamp));
                } catch (err) {
                    console.error("There was an error fetching comments:", err);
                }
            }
        };

        fetchComments();
    }, [commentsContract, postId]);

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newComment.trim() && commentsContract) {
            try {
                const tx = await commentsContract.createComment(newComment.trim(), parseInt(postId));
                const receipt = await tx.wait();
                
                // Save receipt to a file
                saveReceiptToFile(receipt);
                
                const events = receipt.events || [];
                console.log("Transaction events:", events); // Log events for debugging
                
                const newCommentEvent = events.find(event => event.event === 'CommentCreated');
                if (newCommentEvent) {
                    const decodedEvent = commentsContract.interface.decodeEventLog(
                        'CommentCreated',
                        newCommentEvent.data,
                        newCommentEvent.topics
                    );
                    console.log("Decoded event:", decodedEvent); // Log decoded event for debugging
                    const newCommentObj: Comment = {
                        id: decodedEvent.id.toNumber(),
                        text: decodedEvent.text,
                        timestamp: decodedEvent.timestamp.toNumber(),
                        creator: decodedEvent.creator
                    };
                    setComments(prevComments => [newCommentObj, ...prevComments].sort((a, b) => b.timestamp - a.timestamp));
                    setNewComment('');
                } else {
                    console.error("CommentCreated event not found in transaction receipt:", receipt);
                    console.log("Receipt logs:", receipt.logs); // Additional logging for debugging
                    toast.error('Comment creation failed. Please try again!', {
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
            } catch (err) {
                console.error("There was an error trying to submit the comment:", err);
                toast.error('There was an error trying to submit the comment!', {
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
                                    <strong>{key}:</strong> {comment[key]}
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