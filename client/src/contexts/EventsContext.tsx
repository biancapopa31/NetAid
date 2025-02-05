import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {Observable} from "rxjs";
import {Contract} from "ethers";
import {useContracts} from "./ContractsContext";
import {Post} from "../interfaces/Post";


interface EventContextInterface {
    newPostAdded$: Observable<any[]> | undefined;
    profileUpdated$: Observable<any[]> | undefined;
    profileCreated$: Observable<any[]> | undefined;
    commentCreated$: Observable<any[]> | undefined;
    etherRetrieved$: Observable<any[]> | undefined;
}

const EventContext = createContext<EventContextInterface | undefined>(undefined);

interface EventProviderProps {
    children: ReactNode,
}

export const EventProvider: React.FC<EventProviderProps> = ({children}) => {
    const {postsContract, userProfileContract, commentsContract, donationContract} = useContracts();

    const [newPostAdded$, setNewPostAdded$] = useState<Observable<any> | undefined>(undefined);
    const [profileUpdated$, setProfileUpdated$] = useState<Observable<any> | undefined>(undefined);
    const [profileCreated$, setProfileCreated$] = useState<Observable<any> | undefined>(undefined);
    const [commentCreated$, setCommentCreated$] = useState<Observable<any> | undefined>(undefined);
    const [etherRetrieved$, setEtherRetrieved$] = useState<Observable<any> | undefined>(undefined);

    useEffect(() => {
        if (!postsContract) {
            setNewPostAdded$(undefined);
        } else {
            console.log("here");
            setNewPostAdded$(new Observable<any[]>((subscriber) => {
                    const onEvent = (mapArgs) => {
                        subscriber.next(mapArgs);
                    };

                    const addedListener = postsContract.addListener("PostCreated", onEvent);

                    return () => {
                        addedListener.then(() =>
                            postsContract.removeListener("PostCreated", onEvent)
                        );
                    }
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

                const addedListener = userProfileContract.addListener("ProfileUpdated", onEvent);

                return () => addedListener.then(() => userProfileContract.removeListener("ProfileUpdated", onEvent));

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

                const addedListener = userProfileContract.addListener("ProfileCreated", onEvent);

                return () => addedListener.then(() => userProfileContract.removeListener("ProfileCreated", onEvent));

            }));
        }

    }, [userProfileContract]);

    useEffect(() => {
        if(!donationContract)
            setEtherRetrieved$(undefined);
        else{
            setEtherRetrieved$(new Observable<any[]>((subscriber) => {
                const onEvent =(event) => {
                    subscriber.next(event);
                }

                const addedListener = donationContract.addListener("EtherRetreived", onEvent);

                return () => addedListener.then(() => donationContract.removeListener("EtherRetreived", onEvent));

            }));
        }

    }, [donationContract]);

    useEffect(() => {
        if(!commentsContract)
            setCommentCreated$(undefined);
        else{
            setCommentCreated$(new Observable<any[]>((subscriber) => {
                const onEvent =(event) => {
                    subscriber.next(event);
                }

                const addedListener = commentsContract.addListener("CommentCreated", onEvent);

                return () => addedListener.then(() => commentsContract.removeListener("CommentCreated", onEvent));

            }));
        }

    }, [commentsContract]);

    return (
        <EventContext.Provider
            value={{
                newPostAdded$,
                profileUpdated$,
                profileCreated$,
                commentCreated$,
                etherRetrieved$
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
