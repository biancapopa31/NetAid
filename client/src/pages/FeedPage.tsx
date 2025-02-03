import { NewPostCard, PostCard } from "../components";
import { useContracts } from "../contexts/ContractsContext";
import { useEffect, useState } from "react";
import decodeInterface from "../interfaces/decode-interface";
import { Post, postKeys } from "../interfaces/Post";
import { useEvents } from "../contexts/EventsContext";
import { Bounce, toast, ToastContainer } from "react-toastify";

export function FeedPage() {
    const { postsContract } = useContracts();
    const [posts, setPosts] = useState<Post[]>([]);
    const { newPostAdded$, profileCreated$ } = useEvents();

    useEffect(() => {
        if (!newPostAdded$) return;
        const subs = newPostAdded$.subscribe((value) => {
            toast.success('New post!');
            const post = decodeInterface<Post>(postKeys, value);
            setPosts((prevPosts) => {
                // Check if the post already exists to avoid duplicates
                if (prevPosts.some(p => p.id === post.id)) {
                    return prevPosts;
                }
                return [post, ...prevPosts];
            });
        });
        return () => subs?.unsubscribe();
    }, [newPostAdded$]);

    useEffect(() => {
        const getAllPosts = async () => {
            const data = await postsContract.getAllPosts();
            const posts = data.map((elm) => decodeInterface<Post>(postKeys, elm));
            setPosts(posts.reverse());
        };
        getAllPosts();
    }, [postsContract]);

    useEffect(() => {
        if (!profileCreated$) return;
        const sub = profileCreated$.subscribe((value) => {
            toast.success('Profile created successfully!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        });
        return () => sub.unsubscribe();
    }, [profileCreated$]);

    const handleNewPost = (post) => {
        setPosts((prevPosts) => {
            // Check if the post already exists to avoid duplicates
            if (prevPosts.some(p => p.id === post.id)) {
                return prevPosts;
            }
            return [post, ...prevPosts];
        });
    };

    return (
        <div className={"flex flex-col items-center m-2 gap-5"}>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <NewPostCard onNewPost={handleNewPost} />
            {
                posts.map(post => (
                    <PostCard post={post} key={post.id} />
                ))
            }
        </div>
    );
}