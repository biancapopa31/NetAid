import {Avatar, Card, CardBody, CardFooter, CardHeader, Divider, Image} from "@heroui/react";
import React, {JSX, useEffect, useState} from "react";
import {Button} from "@heroui/button";
import {Post} from "../interfaces/Post";
import {useContracts} from "../contexts/ContractsContext";
import {UserProfile, userProfileKeys} from "../interfaces/UserProfile";
import decodeInterface from "../interfaces/decode-interface";
import {pinata} from "../utils/config";
import {pinataService} from "../utils/pinataService";
import {AiFillLike, AiOutlineLike} from "react-icons/ai";
import {FaGasPump, FaRegCommentAlt} from "react-icons/fa";
import {ethers, BrowserProvider, Contract} from "ethers";
import {useEstimatedGas} from "../hooks";
import {useGasConvertor} from "../hooks/useGasConvertor";

export const PostCard: ({post: Post}) => JSX.Element = ({post}) => {

    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [estimateLikeGas, setEstimateLikeGas] = useState<number | null>(null);
    const {provider, userProfileContract, postsContract, signer} = useContracts();

    const likeGas = useEstimatedGas(postsContract.like, post.id);
    const unlikeGas = useEstimatedGas(postsContract.unlike, post.id, likeCount > 0);
    const likeETH = useGasConvertor(provider, likeGas?.gas);
    const unlikeETH = useGasConvertor(provider, likeGas?.gas);

    useEffect(() => {
        userProfileContract.getProfile(post.creator).then((response) => {
            setUserProfile(decodeInterface<UserProfile>(userProfileKeys, response));
        }).catch((err) => {
            console.error("There was an error getting creator data for post: ", post.id, err);
        });

        postsContract.getLikeCount(post.id).then((response) => {
            setLikeCount(Number(response));
        }).catch((err) => {
            console.error("There was an error getting like count for post:", post.id, err);
        });

        postsContract.isLikedByUser(post.id, signer).then((response) => {
            setLiked(response);
        }).catch((err) => {
            console.error("There was an error getting like status for post:", post.id, err);

        })

    }, [post.creator, post.id, postsContract, signer, userProfileContract]);

    // TODO: uncomment this
    // useEffect(() => {
    //     if(userProfile)
    //         pinataService.convertCid(userProfile.profilePictureCid).then((url) => {
    //             setProfilePictureUrl(url);
    //         });
    // }, [userProfile]);

    const handleLike = async () => {
        if (liked) {
            const tx = await postsContract.unlike(post.id);
            await tx.wait();
            setLikeCount(likeCount - 1);
        } else {
            const tx = await postsContract.like(post.id);
            await tx.wait();
            setLikeCount(likeCount + 1);
        }
        setLiked(!liked);
    }
    const handleComment = () => {

    }

    return (
        <Card className="w-full max-w-[1024px] pb-0">
            <CardHeader className="justify-between px-7 pt-7">
                <div className="flex gap-5">
                    <Avatar
                        isBordered
                        radius={"full"}
                        size="md"
                        color="primary"
                        src={process.env.REACT_APP_DEFAULT_PROFILE_PICTURE}
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">@{userProfile?.username}</h4>
                    </div>
                </div>
                <p className={"text-small text-default-400"}> {new Date(Number(post.timestamp)).toLocaleDateString('en-En')} </p>
            </CardHeader>
            <Divider/>
            <CardBody className="px-7 text-small text-default-700 min-h-10 gap-3 py-3">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id libero a risus sollicitudin
                    sodales. Nam eu ante aliquet, posuere felis aliquam, fringilla felis. Quisque eu sagittis dolor.
                    Maecenas sagittis elementum cursus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                    vulputate magna et malesuada eleifend. Donec dolor diam, tincidunt sit amet felis a, malesuada
                    sagittis elit. Fusce gravida tincidunt elementum. Aliquam maximus interdum odio a porta. Phasellus
                    lobortis vulputate enim id venenatis. Integer enim ante, sollicitudin eget ligula eu, euismod
                    dapibus odio. Cras gravida felis massa, in iaculis lectus molestie a. In hac habitasse platea
                    dictumst.
                </p>
                <div className="flex justify-center w-full">
                    <Image
                        alt={"Post Image"}
                        className={"max-h-[20rem]"}
                        radius={"sm"}
                        src={process.env.REACT_APP_DEFAULT_PROFILE_PICTURE}
                    ></Image>
                </div>

            </CardBody>
            <Divider></Divider>
            <CardFooter className="gap-3 px-7">
                <div className="flex justify-between w-full">
                    <div className={"flex gap-3 justify-start"}>
                        <div className={"flex flex-col items-center"}>
                            <Button variant={"light"} onPress={handleLike} color={"primary"}>
                                {likeCount}
                                {liked ?
                                    <AiFillLike size={20} color={'hsl(var(--heroui-primary))'}
                                                style={{color: "primary"}}/>
                                    : <>
                                        <AiOutlineLike size={20}/>
                                    </>
                                }Like
                            </Button>
                            <p className={"flex flex-row text-default-400 text-small gap-1 items-center"}>
                                <FaGasPump />
                                {liked ? unlikeETH?.eth : likeETH?.eth}
                            </p>
                        </div>
                        <Button variant={"light"} color={"primary"} onPress={handleComment}>
                            <FaRegCommentAlt/>
                            Comment
                        </Button>
                    </div>
                    <Button color={"primary"} variant={"ghost"}>
                        Make a donation
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}