import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";

export const useMetamaskSessionGuard = () => {
    const { signOut } = useClerk();

    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = async (accounts: string[]) => {
            // Fires when: account switched, or MetaMask locked (accounts = [])
            await signOut({ redirectUrl: "/" });

        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("disconnect", handleAccountsChanged); 
        window.ethereum.on("chainChanged", handleAccountsChanged);
        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("disconnect", handleAccountsChanged);
            window.ethereum.removeListener("chainChanged", handleAccountsChanged);
        };
    }, [signOut]);
};