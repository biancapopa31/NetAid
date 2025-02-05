import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {Observable} from "rxjs";
import {Contract} from "ethers";
import {useContracts} from "./ContractsContext";
import {Post} from "../interfaces/Post";


interface EventContextInterface {
    newPostAdded$: Observable<any[]> | undefined;
    profileUpdated$: Observable<any[]> | undefined;
    profileCreated$: Observable<any[]> | undefined;
}

const EventContext = createContext<EventContextInterface | undefined>(undefined);

interface EventProviderProps {
    children: ReactNode,
}

export const EventProvider: React.FC<EventProviderProps> = ({children}) => {
    const {postsContract, userProfileContract, commentsContract} = useContracts();

    const [newPostAdded$, setNewPostAdded$] = useState<Observable<any> | undefined>(undefined);
    const [profileUpdated$, setProfileUpdated$] = useState<Observable<any> | undefined>(undefined);
    const [profileCreated$, setProfileCreated$] = useState<Observable<any> | undefined>(undefined);
    const [commentCreated$, setCommentCreated$] = useState<Observable<any> | undefined>(undefined);

    useEffect(() => {
        if (!postsContract) {
            setNewPostAdded$(undefined);
        } else {
            console.log("here");
            setNewPostAdded$(new Observable<any[]>((subscriber) => {
                    console.log("subscribed");
                    const onEvent = (mapArgs) => {
                        subscriber.next(mapArgs);
                    };

                    postsContract.on("PostCreated", onEvent);

                })
            )
        }
    }, [postsContract]);

    useEffect(() => {
        if(!userProfileContract)
            setProfileUpdated$(undefined);
        else{
            setProfileUpdated$(new Observable<any[]>((subscriber) => {
                console.log("subscribed");
                const onEvent =(event) => {
                    subscriber.next(event);
                }

                userProfileContract.addListener("ProfileUpdated", onEvent);

            }));
        }

    }, [userProfileContract]);

    useEffect(() => {
        if(!userProfileContract)
            setProfileCreated$(undefined);
        else{
            setProfileCreated$(new Observable<any[]>((subscriber) => {
                const onEvent =(event) => {
                    subscriber.next(event);
                }

                userProfileContract.addListener("ProfileCreated", onEvent);

            }));
        }

    }, [userProfileContract]);

    useEffect(() => {
        if(!commentsContract)
            setCommentCreated$(undefined);
        else{
            setCommentCreated$(new Observable<any[]>((subscriber) => {
                const onEvent =(event) => {
                    subscriber.next(event);
                }

                commentsContract.addListener("CommentCreated", onEvent);

            }));
        }

    }, [userProfileContract]);

    return (
        <EventContext.Provider
            value={{
                newPostAdded$,
                profileUpdated$,
                profileCreated$,
                commentCreated$
            }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error("useEvents must be used within an EventProvider");
    }
    return context;
};
