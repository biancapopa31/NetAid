import {useCallback, useEffect, useState} from "react";
import {Post} from "../interfaces/Post";
import {pinataService} from "../utils/pinataService";
import decodeInterface from "../interfaces/decode-interface";
import {UserProfile, userProfileKeys} from "../interfaces/UserProfile";
import {PostWithCreator} from "../interfaces/PostWithCreator";
import {useContracts} from "../contexts";

export function useFetchFullPost() {
    const {userProfileContract} = useContracts();

    return useCallback(async (post: Post) => {
        if (!post) {
            throw new Error("No post");
        }

        let result: PostWithCreator = post as PostWithCreator;

        const cidPromise =
            post.photoCid ?
                pinataService.convertCid(post.photoCid).then((url) => result.photoUrl = url) : null;

        const userPromise = userProfileContract.getProfile(post.creator).then(
            (response) => {
                const profile = decodeInterface<UserProfile>(userProfileKeys, response);
                // TODO: Uncomment this when needed
                // profile.profilePictureUrl = await pinataService.convertCid(profile.profilePictureCid);
                profile.profilePictureUrl = process.env.REACT_APP_DEFAULT_PROFILE_PICTURE;

                result = {...result, ...profile};
            }
        ).catch((err) => {
            throw new Error(`Error getting creator data for post: ${post.id} ${err}`);
        });
        await Promise.all([cidPromise, userPromise]);
        return result;
    }, [userProfileContract]);
}