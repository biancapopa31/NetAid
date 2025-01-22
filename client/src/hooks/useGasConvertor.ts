import {BrowserProvider, ethers} from "ethers";
import {useEffect, useState} from "react";


export function useGasConvertor(provider: BrowserProvider | null, gas: number | undefined) {
    const [result, setResult] = useState<{ eth?: number } | undefined>(undefined);
    useEffect(() => {
        if (!provider || !gas) return;
        provider.getFeeData().then((data) => {
            setResult({eth: Math.round(Number(ethers.formatEther(data.gasPrice * gas) * 1e8)) / 1e8})
        });
    }, [gas, provider]);

    return result;
}