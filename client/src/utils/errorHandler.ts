import { toast } from "react-toastify";

interface ErrorOptions {
    message?: string;
    onError?: (e: unknown) => Promise<void> | void
}

const handleErrors = async <T>(fn : () => Promise<T> | T, options?: ErrorOptions): Promise<T | void> => {
    try{
        return (await fn());
    } catch (e){
        console.error(e);
        const toastMessage = options?.message ?? e?.toString() as string;
        toast.error(toastMessage);
        await options?.onError?.(e);
    }
}

export default handleErrors;