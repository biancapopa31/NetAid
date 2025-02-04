import { NewPostCard, PostCard } from "../components";
import { useContracts } from "../contexts/ContractsContext";
import React, {useEffect, useMemo, useState} from "react";
import decodeInterface from "../interfaces/decode-interface";
import { Post, postKeys } from "../interfaces/Post";
import { useEvents } from "../contexts/EventsContext";
import { Bounce, toast, ToastContainer } from "react-toastify";
import {usePosts} from "../contexts";
import {Spinner} from "@heroui/react";
import {useGenerateFullPost, useMapPost} from "../hooks/useGenerateFullPost";
import {PostWithCreator} from "../interfaces/PostWithCreator";

export function FeedPage() {
    const {posts, isLoading, setPosts} = usePosts();
    const { newPostAdded$, profileCreated$ } = useEvents();
    const mapPost = useMapPost();

    useEffect(() => {
        if (!newPostAdded$) return;
        const subs = newPostAdded$.subscribe((value) => {
            console.log("succes!");
            toast.success('New post!');
            // console.log(value)
            const post = decodeInterface<Post>(postKeys, value);
            mapPost(post).then((post) =>
            setPosts([post, ...posts as PostWithCreator[]])
            );

        });
        return () => subs?.unsubscribe();
    }, [newPostAdded$]);

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
    //     setPosts((prevPosts) => {
    //         // Check if the post already exists to avoid duplicates
    //         if (prevPosts.some(p => p.id === post.id)) {
    //             return prevPosts;
    //         }
    //         return [post, ...prevPosts];
    //     });
    };

    if(isLoading) {
        return (
            <Spinner color={"primary"} className={"flex justify-center items-center"}/>
        );
    }

    return (
        <div className={"flex flex-col items-center m-2 gap-5"}>
            <NewPostCard onNewPost={handleNewPost} />
                {
                    posts?.map(post => (
                        <PostCard post={post} key={post.id} />
                    ))
                }
        </div>
    );
}