import { NewPostCard, PostCard } from "../components";
import { useContracts } from "../contexts/ContractsContext";
import React, {useEffect, useMemo, useState} from "react";
import decodeInterface from "../interfaces/decode-interface";
import { Post, postKeys } from "../interfaces/Post";
import { useEvents } from "../contexts/EventsContext";
import { Bounce, toast, ToastContainer } from "react-toastify";
import {usePosts} from "../contexts";
import {Spinner} from "@heroui/react";
import {useFetchFullPost} from "../hooks/useFetchFullPost";
import {PostWithCreator} from "../interfaces/PostWithCreator";

export function FeedPage() {
    const {posts, isLoading, setPosts} = usePosts();
    const { newPostAdded$, profileCreated$ } = useEvents();
    const mapPost = useFetchFullPost();

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
    }, [mapPost, newPostAdded$, posts, setPosts]);

    useEffect(() => {
        if (!profileCreated$) return;
        const sub = profileCreated$.subscribe((value) => {
            toast.success('Profile created successfully!');
        });
        return () => sub.unsubscribe();
    }, [profileCreated$]);

    if(isLoading) {
        return (
            <Spinner color={"primary"} className={"flex justify-center items-center"}/>
        );
    }

    return (
        <div className={"flex flex-col items-center m-2 gap-5"}>
            <NewPostCard/>
                {
                    posts?.map(post => (
                        <PostCard post={post} key={post.id} />
                    ))
                }
        </div>
    );
}