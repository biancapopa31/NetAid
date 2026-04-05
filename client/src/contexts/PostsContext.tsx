import React, { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useContracts } from "./ContractsContext";
import decodeInterface from "../interfaces/decode-interface";
import { Post, postKeys } from "../interfaces/Post";
import { PostWithCreator } from "../interfaces/PostWithCreator";
import { useFetchFullPost } from "../hooks/useFetchFullPost";
import handleErrors from "../utils/errorHandler";

interface PostsContextProps {
    posts: PostWithCreator[] | null;
    setPosts: React.Dispatch<React.SetStateAction<PostWithCreator[] | null>>;
    isLoading: boolean;
}

const initialState: PostsContextProps = {
    posts: null,
    setPosts: () => { },
    isLoading: true,
}

const PostsContext = React.createContext<PostsContextProps>(initialState);

interface PostsProviderProps {
    children: ReactNode,
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const { userProfileContract, postsContract } = useContracts();
    const [posts, setPosts] = useState<PostWithCreator[] | null>(null);
    const mapPost = useFetchFullPost();


    const getAllPosts = useCallback(async () => {
        if (!postsContract || !userProfileContract) {
            return;
        }
        handleErrors(async () => {
            const data = await postsContract.getAllPosts();
            const posts = await Promise.all(data.map(async (elm: any) => {
                const post = decodeInterface<Post>(postKeys, elm);
                return await mapPost(post);
            }));
            setPosts(posts.reverse());
            setIsLoading(false);
        }, "Failed to fetch posts. Please try again later.");
    }, [postsContract, userProfileContract]);

    useEffect(() => {
        getAllPosts();
    }, [getAllPosts]);



    return (
        <PostsContext.Provider value={{
            posts, setPosts,
            isLoading,
        } as PostsContextProps}>
            {children}
        </PostsContext.Provider>
    );
};

export const usePosts = () => useContext(PostsContext);