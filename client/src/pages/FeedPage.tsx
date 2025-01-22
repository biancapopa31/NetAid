import {NewPostCard, PostCard} from "../components";
import {useContracts} from "../contexts/ContractsContext";
import {useEffect, useState} from "react";
import decodeInterface from "../interfaces/decode-interface";
import {Post, postKeys} from "../interfaces/Post";

export function FeedPage() {
    const {postsContract} = useContracts();
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const getAllPosts = async () => {
            const data = await postsContract.getAllPosts();
            console.log(data);
            const posts = data.map((elm) => decodeInterface<Post>(postKeys, elm))
            setPosts(posts.reverse());
            console.log(posts);
        }
        getAllPosts();
    }, [postsContract])

    return (
        <div className={"flex flex-col items-center m-2 gap-5"}>
            <NewPostCard/>
            {
                posts.map(post => (
                    <PostCard post={post} key={post.id} />
                ))
            }
        </div>
    )
}