import React, {ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {useUser} from "@clerk/clerk-react";
import {useContracts} from "./ContractsContext";
import {ethers} from "ethers";
import {pinata} from "../utils/config";
import {useLoader} from "./LoaderContext";
import decodeInterface from "../interfaces/decode-interface";
import {UserProfile, userProfileKeys} from "../interfaces/UserProfile";
import {pinataService} from "../utils/pinataService";
import {Post, postKeys} from "../interfaces/Post";
import {PostWithCreator} from "../interfaces/PostWithCreator";
import {toast} from "react-toastify";
import warning = toast.warning;
import {useMapPost} from "../hooks/useGenerateFullPost";

interface PostsContextProps {
    posts: PostWithCreator[] | null;
    setPosts: React.Dispatch<React.SetStateAction<PostWithCreator[]|null>>;
    isLoading: boolean;
}

const initialState: PostsContextProps = {
    posts: null,
    setPosts: () => {},
    isLoading: true,
}

const PostsContext = React.createContext<PostsContextProps>(initialState);

interface PostsProviderProps {
    children: ReactNode,
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const {userProfileContract, postsContract} = useContracts();
    const [posts, setPosts] = useState<PostWithCreator[]|null>(null);
    const mapPost = useMapPost();


    const getAllPosts = useCallback(async () => {
        if(!postsContract || !userProfileContract){
            return;
        }
        const data = await postsContract.getAllPosts();
        const posts = await Promise.all(data.map(async (elm) => {
            const post = decodeInterface<Post>(postKeys, elm);
            return await mapPost(post);

        }));
        setPosts(posts.reverse());
        setIsLoading(false);
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