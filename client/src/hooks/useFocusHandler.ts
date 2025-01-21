import {useEffect} from "react";

export function useFocusHandler(ref, setFocus){
    useEffect(() => {
        function handleClick(event) {
            if(!ref.current){
                return;
            }
            setFocus(ref.current.contains(event.target));
        }

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        }
    }, [ref, setFocus]);
}