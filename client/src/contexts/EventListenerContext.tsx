import {useContext, useEffect, useState} from "react";
import {useContracts} from "./ContractsContext";

function useEventListener(contract, eventName) {
    const [callbackCounter, setCallbackCounter] = useState(0);
    const [callbacks, setCallbacks] = useState({});

    const addCallback = (callback: (data) => void) => {
        const id = callbackCounter;

        setCallbackCounter((prev) => prev + 1);
        setCallbacks((prev) => ({...prev, [id]: callback}));

        return () => {
            setCallbacks((prev) => {
                delete prev[id];
                return prev;
            });
        }
    };

    useEffect(() => {
        const listener = contract.on(eventName, (from, to, value, eventData) => {
            Object.values(callbacks).forEach((callback) => callback(eventData));
        });

        return listener.unsubscribe();
    }, [contract]);

    return addCallback;
}

const EventProvider = ({children}) => {
    const {postsContract} = useContracts();

    const addPostCallback = useEventListener(postsContract, "PostCreated");

    return (
        <EventProvide.Provider value={{addPostCallback}}>
            {
            children}
        </EventProvide.Provider>);
}
}
;

const useEvent = () => useContext(EventContext);