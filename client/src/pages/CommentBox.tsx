import React, { useEffect, useState } from "react";
import { useContracts } from "../contexts/ContractsContext";
import { Comment, commentKeys } from "../interfaces/Comment";
import decodeInterface from "../interfaces/decode-interface";

const CommentBox = ({ postId }) => {
    const { commentsContract } = useContracts();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const data = await commentsContract.getCommentsForPost(postId);
            const decodedComments = data.map((comment) => decodeInterface<Comment>(commentKeys, comment));
            setComments(decodedComments);
        } catch (error) {
            console.error("There was an error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    return (
        <div>
            {loading ? (
                <p>Loading comments...</p>
            ) : (
                comments.map((comment) => (
                    <div key={comment.id}>
                        <p>{comment.text}</p>
                        <small>{new Date(comment.timestamp * 1000).toLocaleString()}</small>
                    </div>
                ))
            )}
        </div>
    );
};

export default CommentBox;
